var app_version = "1.1.2";

/*******************************   version = 1.1.2  ********************************************
- set cordova.plugins.Keyboard.hideKeyboardAccessoryBar() to FALSE


/*******************************   version = 1.1.2  ********************************************
new functionnalities :
- historic tab: 
  o add +/- buttons
  o refresh list only on broadcast reception
- graph tab: set default duration to 2 weeks
- baby demo: merge record when record already exist

/*******************************   version = 1.1.0  ********************************************
new functionnalities :
- add CHARTS:
  o create BREAST/BOTTLE/WEIGHT(1rst month) charts
  o add option to select time scale (1,2,4 weeks)
  o add option to select total or average display
- add DEMO BABY:
  o create virtual record for 1 month
  o create one if no baby in DB.
- add MULTI-BABY selection
- replace side menu by a tab ('settings')
- remove 'config_current_baby' in DB entries.
- reformat rec_records :
  o add 'babyUID' property  
  o add 'selected' property
  o remove empty property
  o remove 'show' property
  o rename 'bottleContent' in 'quantity' 

/*******************************   version = 0.2.1  ********************************************
new functionnalities:
-add luminosity control

/*******************************   version = 0.2.0  ********************************************
new functionnalities (in progress):
- historic tab displays only fields selected in configuration menu
- color right bar button (in darkcyan)
- french/english language choice
- full english translation
bug fixed:
- historic tab display is back from last entry

/*******************************   version = 0.1.4  ********************************************
new functionnalities :
- add a 'weight/height' info field 
- add a config_input_display param in DB
- add a side menu
- add option to configure input display
- remove settings tab
- add baby picture
bug fixed:
- make scrollBottom work properly

/*******************************   version = 0.1.3  ********************************************
new functionnalities :
- add a 'medecine' info field to follow medecine distribution 
- reorganize hitoric display

/*******************************   version = 0.1.2  ********************************************
bug fixed: 
- when PAUSE button is pressed, RUN button is back to enable state. 

/*******************************   version = 0.1.1  ********************************************
new functionnalities:
- add a 'note' info field to store text message 

/*******************************   version = 0.1.0  ********************************************
new functionnalities:
- store and manage baby information (through setting tab)

*/