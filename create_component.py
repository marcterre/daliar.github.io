import json
import os

# Get user inputs
component_name = input("Enter component name: ")
package_path = "./"
dir_path = input("Enter the directory path where you want to create the component (default: components): ") or "components"
default_style_type = "tsx"
style_type = input("Enter the style type (tsx or scss): ") or default_style_type

# Create the component directory
component_dir = os.path.join("src/" + dir_path, component_name)
os.makedirs(component_dir)

# Create the component files and write content 
with open(os.path.join(component_dir, "index.ts"), "w") as f:
    f.write(f"export * from './{component_name}'\n")

# Create the component file and write content
with open(os.path.join(component_dir, f"{component_name}.tsx"), "w") as f:
    f.write(f"import React from 'react';\n")

    if style_type == "tsx":
        f.write(f"import {{ {component_name}Styles }} from './{component_name}.styles';\n\n")
    else:
        f.write(f"import './{component_name}.styles.{style_type}'\n\n")      

    f.write(f"type {component_name}Props = {{\n")
    f.write(f"  // props\n")
    f.write(f"}}\n\n")
    f.write(f"export const {component_name} = () => {{\n")
    f.write(f"  return (\n")
    f.write(f"    <div className='{component_name}'>\n")
    f.write(f"      {component_name}\n")
    f.write(f"    </div>\n")
    f.write(f"  )\n")
    f.write(f"}}\n\n")
    f.write(f"export default {component_name};\n")


# Create the styles file and write content
with open(os.path.join(component_dir, f"{component_name}.styles.{style_type}"), "w") as f:
    if style_type == "tsx":
        f.write(f"import React from 'react';\n")
        f.write(f"export const {component_name}Styles = {{ /* Style */ }}\n")
    else:
        f.write(f".{component_name} {{ /* Style */ }}\n")

# Create the test file and write content
with open(os.path.join(component_dir, f"{component_name}.test.tsx"), "w") as f:
    f.write(f"import {{ render, screen }} from '@testing-library/react';\n")
    f.write(f"import {component_name} from './{component_name}';\n\n")
    f.write(f"describe('{component_name}', () => {{\n")
    f.write(f"  test.skip('renders the {component_name} component', () => {{\n")
    f.write(f"    render(<{component_name} />);\n")
    f.write(f"    const component = screen.getByText('{component_name}');\n")
    f.write(f"    expect(component).toBeInTheDocument();\n")
    f.write(f"  }});\n")
    f.write(f"}});\n")

# Create the story file and write content
with open(os.path.join(component_dir, f"{component_name}.stories.tsx"), "w") as f:
    f.write("import type { Meta, StoryObj } from '@storybook/react';\n")
    f.write(f"import {{ {component_name} }} from './{component_name}';\n\n")
    f.write(f"const meta: Meta<typeof {component_name}> = {{\n")
    f.write(f"  title: '{dir_path}/{component_name}',\n")
    f.write(f"  component: {component_name},\n")
    f.write(f"}};\n\n")
    f.write("export default meta;\n")
    f.write(f"type Story = StoryObj<typeof {component_name}>;\n\n")
    f.write(f"export const Default: Story = {{\n")
    f.write(f"  args: {{\n")
    f.write(f"    // props\n")
    f.write(f"  }},\n")
    f.write("};\n")



# Add export statement to the index.ts file
with open(os.path.join("src/" + dir_path, "index.ts"), "a") as f:
    f.write(f"export * from './{component_name}';\n")

# Adds sass to package.json if not already listed
os.chdir(package_path)
if not os.path.exists("package.json"):
    print("Error: package.json file not found")
else:
    # read package.json file
    with open("package.json", "r") as f:
        package_data = json.load(f)

    # check if "sass" is listed under "dependencies"
    if "dependencies" not in package_data:
        package_data["dependencies"] = {}
    if "sass" not in package_data["dependencies"]:
        # add "sass" to "dependencies"
        package_data["dependencies"]["sass"] = "^1.6.2"

        # save the modified package.json file
        with open("package.json", "w") as f:
            json.dump(package_data, f, indent=2)

        print("sass added to dependencies in package.json")
    else:
        print("sass already listed under dependencies in package.json")