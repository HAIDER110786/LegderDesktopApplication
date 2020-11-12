const electron = require('electron');
const path = require('path');
const url = require('url');
const mongoose = require('mongoose');
const Transaction = require('./transactionSchema');
const moment = require('moment');

const transactions = [
  {
    date:date(),
    voucher:'BRKR',
    Particulars:'0.30*1000 PRIME = 639764 [MP - 800]',
    Qty:4994,
    Rate:146626,
    Debit:733249,
    Credit:0,
    Balance:'3966 Dr'
  },
  {
    date:date(),
    voucher:'BRKR',
    Particulars:'0.30*1000 PRIME = 639764 [MP - 800]',
    Qty:4994,
    Rate:146626,
    Debit:733249,
    Credit:0,
    Balance:'3966 Dr'
  },
  {
    date:date(),
    voucher:'BRKR',
    Particulars:'0.30*1000 PRIME = 639764 [MP - 800]',
    Qty:4994,
    Rate:146626,
    Debit:733249,
    Credit:0,
    Balance:'3966 Dr'
  },
  {
    date:date(),
    voucher:'BRKR',
    Particulars:'0.30*1000 PRIME = 639764 [MP - 800]',
    Qty:4994,
    Rate:146626,
    Debit:733249,
    Credit:0,
    Balance:'3966 Dr'
  },
  {
    date:date(),
    voucher:'BRKR',
    Particulars:'0.30*1000 PRIME = 639764 [MP - 800]',
    Qty:4994,
    Rate:146626,
    Debit:733249,
    Credit:0,
    Balance:'3966 Dr'
  },
  {
    date:date(),
    voucher:'BRKR',
    Particulars:'0.30*1000 PRIME = 639764 [MP - 800]',
    Qty:4994,
    Rate:146626,
    Debit:733249,
    Credit:0,
    Balance:'3966 Dr'
  },
  {
    date:date(),
    voucher:'BRKR',
    Particulars:'0.30*1000 PRIME = 639764 [MP - 800]',
    Qty:4994,
    Rate:146626,
    Debit:733249,
    Credit:0,
    Balance:'3966 Dr'
  },
  {
    date:date(),
    voucher:'BRKR',
    Particulars:'0.30*1000 PRIME = 639764 [MP - 800]',
    Qty:4994,
    Rate:146626,
    Debit:733249,
    Credit:0,
    Balance:'3966 Dr'
  },
  {
    date:date(),
    voucher:'BRKR',
    Particulars:'0.30*1000 PRIME = 639764 [MP - 800]',
    Qty:4994,
    Rate:146626,
    Debit:733249,
    Credit:0,
    Balance:'3966 Dr'
  },
];

// SET ENV
process.env.NODE_ENV = 'development';

const {app, BrowserWindow, Menu, ipcMain, dialog} = electron;

let mainMenuWindow;
let mainWindow;
let addWindow;

// Listen for app to be ready
app.on('ready', async function(){

 const connection = await mongoose.connect('mongodb://localhost/transaction',{ useNewUrlParser: true , useUnifiedTopology: true});

  if(connection)
  {
    const yearsFromDB = await Transaction.find({},'year');

    // yearsFromDB.forEach(yearFromDB => console.log(yearFromDB.year));
    // console.log(yearsFromDB.length);

    // Create new window
    mainMenuWindow = new BrowserWindow({width:400, height:400});
    // Load html in window
    mainMenuWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainMenu.html'),
    protocol: 'file:',
    slashes:true
    }));// file://directoryName/filename

    mainMenuWindow.webContents.on('did-finish-load',function(e){
      mainMenuWindow.webContents.send('inject-the-years',yearsFromDB);
    });
    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);

    // Quit app when main window is closed
    mainMenuWindow.on('closed', function(){
      app.quit();
    });
  }
  else{
    console.log('error in connecting to the database');
  }
});

// Handle add transaction window
function createAddWindow(){
  addWindow = new BrowserWindow({
    width: 600,
    height:600,
    title:'Add Transactions',
    parent: mainMenuWindow,
    modal: true,
    show: true
  });
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Handle garbage collection
  addWindow.on('close', function(){
    addWindow = null;
  });
}

//handle see transaction window
async function createSeeWindow(dateOBJ,condition){

  console.log(dateOBJ);
  const {year} = dateOBJ;
  let {day,month} = dateOBJ;
  const monthYear = `${month}, ${year}`;
  let filteredTransactions;
  let formattedDate;
  let filterBy;
  
  if(day && month && year){  
    filterBy = 'date';
    if(day<10){
      day='0'+day;
    }
    month = moment().month(month).format("M");
    if(month<10){
      month ='0'+month;
    }
    formattedDate = `${month}/${day}/${year}`;
    filteredTransactions = await Transaction.find({date:formattedDate});
    // console.log(filteredTransactions);
  }
  
  else if(!day && month && year){
    filterBy = 'month_year';
    month = moment().month(month).format("M");
    if(month<10){
      month ='0'+month;
    }
    const formattedMonthYear = `${month}${year}`;
    filteredTransactions = await Transaction.find({month_year:formattedMonthYear});
    // console.log(filteredTransactions);
  }
  
  else if(!day && !month && year){
    filterBy = 'year';
    filteredTransactions = await Transaction.find({year:year})
    // console.log(filteredTransactions);
  }

  console.log('the filtered transactions are:'+filteredTransactions);


  if(filteredTransactions.length>0){
    if(condition===1){
      mainWindow = new BrowserWindow({
        width: 1000,
        height:600,
        title:'See Transactions',
        parent: mainMenuWindow,
        modal: true,
        show: true
      });
      mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes:true
      }));
      mainWindow.webContents.on('did-finish-load',function(e){
        mainWindow.webContents.send('load-filtered-data',JSON.stringify(filteredTransactions));
        switch(filterBy){
          case 'date':
            mainWindow.webContents.send('filteredby-conditions',{date:formattedDate});
            break;
  
          case 'month_year':
            mainWindow.webContents.send('filteredby-conditions',{month_year:monthYear});
            break;
  
          case 'year':
            mainWindow.webContents.send('filteredby-conditions',{year});
            break;
        }
      });
    }
    else if (condition===2 || condition===3){
      mainWindow.webContents.send('load-filtered-data',JSON.stringify(filteredTransactions));
      switch(filterBy){
        case 'date':
          mainWindow.webContents.send('filteredby-conditions',{date:formattedDate});
          break;

        case 'month_year':
          mainWindow.webContents.send('filteredby-conditions',{month_year:monthYear});
          break;

        case 'year':
          mainWindow.webContents.send('filteredby-conditions',{year});
          break;
      }
    }

    // Handle garbage collection
    mainWindow.on('close', function(){
      mainWindow = null;
    });
  }
  else{
    if(condition===3){
      mainWindow.on('close', function(){
        mainWindow = null;
      });
      mainWindow.close();
    }else{
      const options = {
        type:"warning",
        title : 'No Transaction',
        message : 'There are no transactions on your specified date'
      }
      dialog.showMessageBox(null,options);
    }
  }
}

ipcMain.on('record-transaction',()=>{
  createAddWindow();
})

ipcMain.on('see-transaction',(e,dateOBJ)=>{
  createSeeWindow(dateOBJ,1);
})

ipcMain.on('delete-transaction',async (e,UpdatedTransactionDetails)=>{
  const {filtered_by_entity,id} = UpdatedTransactionDetails;
  const deletedTransaction = await Transaction.findOneAndDelete({_id:mongoose.Types.ObjectId(id)},{useFindAndModify:false});
  createSeeWindow(filtered_by_entity,3);
})

ipcMain.on('update-transaction',async (e,UpdatedTransactionDetails)=>{
  // addWindow.on('close',()=>addWindow=null);
  // addWindow.close();
  const {f_b_e, ud, id} = UpdatedTransactionDetails;

  const newUpdatedTransaction = {
    voucher:ud.voucher,
    Particulars:ud.Particulars,
    Qty:ud.Qty,
    Rate:ud.Rate,
    Debit:ud.Debit,
    Credit:ud.Credit,
    Balance:ud.Balance,
  };

  const seeUpdatedTransaction = await Transaction.findOneAndUpdate({_id:mongoose.Types.ObjectId(id)},newUpdatedTransaction,{new:true, useFindAndModify: false });
  console.log(seeUpdatedTransaction);

  createSeeWindow(f_b_e,2)
})

// Catch item:add event
// In our case the event is sent from the add window to the main js file 
// and the main js file send that item to the mainwindow window 
// where is the item is appended to the current list
ipcMain.on('item:add', async function(e, formData){

  addWindow.on('close',()=>addWindow=null);
  addWindow.close();

  const newTransaction = new Transaction({
    date:formData.date,
    voucher:formData.voucher,
    Particulars:formData.Particulars,
    Qty:formData.Qty,
    Rate:formData.Rate,
    Debit:formData.Debit,
    Credit:formData.Credit,
    Balance:formData.Balance,
    month_year:formData.month_year,
    year:formData.year,
  })

  try {
    const savedTransaction = await newTransaction.save();
    if(savedTransaction){
      const yearsFromDB = await Transaction.find({},'year');
      mainMenuWindow.webContents.send('inject-the-years',yearsFromDB);
    }
  } catch (e) {
    console.log(e);
  }
  //Still have a reference to addWindow in memory. Need to reclaim memory (Garbage collection)
  //addWindow = null;
});

// Create menu template
const mainMenuTemplate =  [
  // Each object is a dropdown
  {
    label: 'File',
    submenu:[
      {
        label: 'Quit',
        accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }
];

// If OSX, add empty object to menu
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}

// Add developer tools option if in dev
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}

function date(){
  let today = new Date();
  let dd = String(today. getDate()). padStart(2, '0');
  let mm = String(today. getMonth() + 1). padStart(2, '0'); //January is 0!
  let yyyy = today. getFullYear();
  return mm + '/' + dd + '/' + yyyy;
}