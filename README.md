# Web client
## To generate api from swagger run command "npm run generate-services"
This is used only for quicker creation of models and services and shouldn't be pushed to the branch. These models and services should be moved to "api" folder and refactored.

## Module structure
AppModule:
  AppRoutingModule
  AuthenticationModule
  CoreModule (shared components: layout, account-selector, shared services). Can be imported only in AppModule
  SharedModule (shared modules). Can be imported in the feature modules
  FeatureModule (e.g. Accounts). Imports Shared module and other stuff needed for this part (routing, store)

## Extensions for VS Code:
EditorConfig for VS Code - to have the same formatting rules
