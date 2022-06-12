import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import '../../assets/img/cross-32.png';

import { initializeApp } from 'firebase/app';
import { addDoc, collection, getFirestore } from 'firebase/firestore/lite';

import { defaults } from '../../shared/defaults';

// Your web app's Firebase configuration
const firebaseConfig = {
  authDomain: 'an-array-of-constraints.firebaseapp.com',
  projectId: 'an-array-of-constraints',
  storageBucket: 'an-array-of-constraints.appspot.com',
  messagingSenderId: '851568643658',
  appId: '1:851568643658:web:c98b783cceeb62dc5be0b3',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const imageCollection = collection(db, 'images');

chrome.storage.sync.set({ openInTab: defaults.openInTab });
chrome.storage.sync.set({ download: defaults.download });

chrome.browserAction.setTitle({
  title:
    'Hold the Option/Alt key and drag the mouse to create partial screenshots.\nClick the icon to create full-page screenshots.',
});

chrome.browserAction.onClicked.addListener(function () {
  chrome.tabs.captureVisibleTab(function (screenshotUrl) {
    if (!screenshotUrl) {
      return;
    }

    chrome.downloads.download({
      url: screenshotUrl,
      filename: `${new Date().getTime().toString()}.jpg`,
    });

    addDoc(imageCollection, {
      image: screenshotUrl,
      date: new Date().toISOString(),
    });
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg === 'FULL_SCREENSHOT') {
    console.log('FULL_SCREENSHOT');
    chrome.tabs.captureVisibleTab((screenshotUrl) => {
      if (!screenshotUrl) {
        return;
      }

      chrome.downloads.download({
        url: screenshotUrl,
        filename: `${new Date().getTime().toString()}.jpg`,
      });

      addDoc(imageCollection, {
        image: screenshotUrl,
        date: new Date().toISOString(),
      });
    });
  }
});
