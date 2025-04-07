# How to use
1. Clone the repo
2. replace your webapp folder with the webapp folder in this project
3. run `npm i` at the same level as the package.json
4. Make sure you have mbt, mta and cf installed via npm. 
   - for cf: brew install cloudfoundry/tap/cf-cli@8 (refer https://github.com/cloudfoundry/cli/wiki/V8-CLI-Installation-Guide, for more info)
   - for mbt: npm i mbt
   - for mta: npm i mta
5. cf login
   - after this enter your email and password, choose your space if you configured the same in btp cockpit or asked to.
6. Create a `approuter` folder at the same level as the package.json (ouch, it's already created 😂, cuz you cloned this repo... You can ignore this step)
7. Make sure to change the route in the `mta.yaml` file before building the project.
  ```bash
      - route: <Unique_Application_Name>.cfapps.eu12.hana.ondemand.com	// please check your BTP Cockpit's landscape for the extension i.e (`cfapps.eu12.hana.ondemand.com`), but if your BTP accunt is BPM subaccount this should work fine.
  ```
8. Make sure you're getting the ui5 resource from an cdn. Meaning replace the src="/resources/..." in the index.html to   `src="https://openui5.hana.ondemand.com/resources/sap-ui-core.js"`
9. Run `npm run build:cf` at the same level as the package.json
10. After the above command you should see a mta_archives folder containing an .mtar file, and also some files and folders must have appeared in the approuter folder, which was initially empty.
11. Run `cf deploy ./mta_archives/<name of the mtar file>.mtar ` at the same level as of the package.json
12. If you get an error `cf deploy not a valid command or deploy not valid command` run 
```bash
    cf add-plugin-repo CF-Community https://plugins.cloudfoundry.org // this is important
    cf install-plugin multiapps // not required
    cf install-plugin html5-plugin // not required 
```
and re-run the command 11.

# About the example webapp
## Installation
  - Clone this repo // if you wish to contribute, fork then clone :)
  - npm i // You might need to use "sudo npm i"
  - npm i --global @ui5/cli // ui5 installation
  - npm start // to start the development server

## Endpoints on the UI
  ### Admin Endpoints
    - /loginAdmin (admin login)
    - /addAirport
    - /addFlight
  ### Admin credentials
    visit /loginAdmin and enter the following credentials to login as admin.
    username = admin
    password = user
    
  



