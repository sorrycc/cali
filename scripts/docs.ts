import dedent from 'dedent'
import * as fs from 'fs'
import * as glob from 'glob'
import * as path from 'path'
import ts from 'typescript'

const toolsDir = 'src/tools'
const outputDir = 'docs'

// Get all TypeScript files in tools directory except vendor-*
const files = glob.sync(path.join(toolsDir, '*.ts'), {
  ignore: path.join(toolsDir, 'vendor-*.ts'),
})

// Process each file
files.forEach((filePath) => {
  const outputFilePath = path.join(outputDir, `${path.basename(filePath, '.ts')}.md`)

  // Read the TypeScript file
  const fileContent = fs.readFileSync(filePath, 'utf-8')

  // Create a TypeScript source file
  const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true)

  // Initialize markdown content
  let markdownContent = `# ${filePath}\n\n`

  // Traverse the AST to find export const declarations
  function visit(node: ts.Node) {
    if (ts.isVariableStatement(node)) {
      node.declarationList.declarations.forEach((declaration) => {
        if (ts.isIdentifier(declaration.name) && declaration.initializer) {
          const toolName = declaration.name.text
          const toolObject = declaration.initializer

          if (
            ts.isCallExpression(toolObject) &&
            ts.isIdentifier(toolObject.expression) &&
            toolObject.expression.text === 'tool'
          ) {
            const args = toolObject.arguments[0]
            if (args && ts.isObjectLiteralExpression(args)) {
              const description = args.properties.find(
                (prop) =>
                  ts.isPropertyAssignment(prop) &&
                  ts.isIdentifier(prop.name) &&
                  prop.name.text === 'description'
              )
              const parameters = args.properties.find(
                (prop) =>
                  ts.isPropertyAssignment(prop) &&
                  ts.isIdentifier(prop.name) &&
                  prop.name.text === 'parameters'
              )
              const execute = args.properties.find(
                (prop) =>
                  ts.isPropertyAssignment(prop) &&
                  ts.isIdentifier(prop.name) &&
                  prop.name.text === 'execute'
              )

              markdownContent += generateMarkdown(toolName, description, parameters, execute)
            }
          }
        }
      })
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
  }

  // Save the markdown content to a file
  fs.writeFileSync(outputFilePath, markdownContent, 'utf-8')
  console.log(`Generated documentation at ${outputFilePath}`)
})

// Helper function to find all return statements in a function body
function findReturnStatements(node: ts.Node): ts.ReturnStatement[] {
  const returns: ts.ReturnStatement[] = []

  function visit(node: ts.Node) {
    if (ts.isReturnStatement(node)) {
      returns.push(node)
    }
    ts.forEachChild(node, visit)
  }

  visit(node)
  return returns
}

// Function to generate markdown content
function generateMarkdown(
  toolName: string,
  description: ts.ObjectLiteralElementLike | undefined,
  parameters: ts.ObjectLiteralElementLike | undefined,
  execute: ts.ObjectLiteralElementLike | undefined
): string {
  let descriptionText = 'No description available'

  if (description && ts.isPropertyAssignment(description)) {
    if (ts.isStringLiteral(description.initializer)) {
      descriptionText = description.initializer.text
    } else if (ts.isTaggedTemplateExpression(description.initializer)) {
      // Handle dedent`...` case
      const template = description.initializer.template
      if (ts.isNoSubstitutionTemplateLiteral(template)) {
        descriptionText = dedent(template.text)
      } else if (ts.isTemplateExpression(template)) {
        descriptionText = template.getText().replace(/^`|`$/g, '').trim()
      }
    }
  }

  let parametersText = 'No parameters'
  if (parameters && ts.isPropertyAssignment(parameters)) {
    const lines = parameters.initializer.getText().split('\n')
    parametersText = lines
      .map((line, index) => {
        line = line.trim()
        if (index === 0) return line
        if (index === lines.length - 1) return line
        return line ? `  ${line}` : ''
      })
      .filter(Boolean)
      .join('\n')
  }

  let returnType = 'Unknown'
  if (execute && ts.isPropertyAssignment(execute) && ts.isArrowFunction(execute.initializer)) {
    const returnStatements = findReturnStatements(execute.initializer.body)
    if (returnStatements.length > 0) {
      returnType = returnStatements
        .map((stmt) => stmt.expression)
        .filter((expr): expr is ts.Expression => expr !== undefined)
        .map((expr) => {
          const lines = expr.getText().split('\n')
          const formattedLines = lines
            .map((line, index) => {
              line = line.trim()
              if (index === 0) return line
              if (index === lines.length - 1) return line
              return line ? `  ${line}` : ''
            })
            .filter(Boolean)
            .join('\n')
          return `\`\`\`typescript\n${formattedLines}\n\`\`\``
        })
        .join('\n')
    }
  }

  if (parametersText === 'z.object({})') {
    parametersText = ''
  } else {
    parametersText = `### Parameters
\`\`\`typescript
${parametersText}
\`\`\``
  }

  return `## ${toolName}
${descriptionText}
${parametersText}
### Return Type
${returnType}
`
}
