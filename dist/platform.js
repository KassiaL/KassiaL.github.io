let platform = 'null';
let isMobile = false;
let bridge, service = '', ID;

function yandexPlatformInit(){
   console.log('Yandex SDK initialize....');
   YaGames.init().then(ysdk => {
      window.ysdk = ysdk;
      console.log('Yandex SDK initialized');
      
      window.ysdk.getPlayer({scopes: false}).then(_player => {
         window.player = _player;
         console.log(window.player);
         if (window.player.getMode() === "lite") {
            console.log("Player not register");
            return;
         }
     }).catch(err => {
         console.log("Init player error");
     });

      window.showInterstitialAd = function(){
         if (window.ysdk == null) { console.log("ysdk not inited"); return; }
         window.ysdk.adv.showFullscreenAdv({
            callbacks: {
                onClose: function(wasShown) {
                  console.log("InterstitalAd wasShown: " + wasShown);
                  window.interstitialAdCloseCallback();
                },
                onError: function(error) {
                  console.log("InterstitalAd error: " + error);
                  window.interstitialAdErrorCallback();
                }
            }
        });
      };

      window.showRewardedAd = function(){
         if (window.ysdk == null) { console.log("ysdk not inited"); return; }
         window.ysdk.adv.showRewardedVideo({
            callbacks: {
                onOpen: () => {
                  console.log('Video ad open.');
                },
                onRewarded: () => {
                  window.rewardedAdShownCallback();
                },
                onClose: () => {
                  window.rewardAdCloseCallback();
                }, 
                onError: (e) => {
                  window.rewardAdErrorCallback();
                }
            }
        });
      };

      window.saveProgress = function(strings){
         if (window.player == null) {
            console.log("player is null");
            return;
         }
         if (window.player.getMode() === "lite"){
            console.log("player is lite");
            window.ysdk.auth.openAuthDialog().then(() => {
               // Игрок успешно авторизован
               initPlayer().catch(err => {
                   // Ошибка при инициализации объекта Player.
               });
           }).catch(() => {
               // Игрок не авторизован.
           });
           return;
         }
         let collection = { "value" : strings };
         console.log("saved: ");
         console.log(collection);
         window.player.setStats(collection);
      };

      window.getProgress = function(){
         console.log("Try to get progress");
      if (window.player == null) {
         console.log("player is null");
         return;
      }
      if (window.player.getMode() === "lite") {
         console.log("player mode is lite");
         return;
      }
      window.player.getStats().then((stats) => {
         if (stats == null) {
            console.log("stats is null");
            return;
         }
         console.log(stats);
         let str = "";
         str += stats['value'];
         //window.unityInstance.SendMessage('Singlton', 'GetProgress', str);
         window.sendProgressToGame(str);
         console.log("progress sended to game");
      });
      };

      window.inviteFriends = function(){
         
      };

      window.wallPost = function (str){
         
      };
      
      window.showLeaderBox = function (level){
         
      };

      window.logEventFirebase = function(eventName, eventValue){

      };

      });
}

function vkPlatformInit(){
   console.log('Vk SDK initialize....');
   bridge = vkBridge.default;
   bridge.send("VKWebAppInit", {});
   service = "013fc4a9013fc4a9013fc4a93e01467d360013f013fc4a96054f82ad37e5f15f0c238c3";
   ID = 0;
   bridge.send("VKWebAppGetUserInfo").then(function(dat){ ID = dat.id; });
   console.log('Vk SDK initialized');

   window.showInterstitialAd = function(){
      if (service == '') { console.log("VK BRIDGE NOT INITIALIZE"); return; }
         bridge.send("VKWebAppShowNativeAds", {ad_format:"interstitial"});
   };

   window.showRewardedAd = function(){
      if (service == '') { console.log("VK BRIDGE NOT INITIALIZE"); return; }
         bridge.send("VKWebAppCheckNativeAds", {"ad_format": "reward"});
   };

   window.saveProgress = function(strings){
      
   };

   window.getProgress = function(){
      
   };

   window.inviteFriends = function(){
      if (service == '') { console.log("VK BRIDGE NOT INITIALIZE"); return; }
   if (isMobile)
   bridge.send("VKWebAppShare", {"link": "https://vk.com/app7977375"});
   else
   VK.callMethod("showInviteBox");
   };

   window.wallPost = function (str){
      if (platform == "Vk"){
         if (service == '') { console.log("VK BRIDGE NOT INITIALIZE"); return; }
         bridge.send("VKWebAppShowWallPostBox", {"message": Pointer_stringify(str), "attachments" : "https://vk.com/app7977375", "v":"5.73"});
      }
   };
   
   window.showLeaderBox = function (level){
      if (platform == 'Vk'){
         if (service == '') { console.log("VK BRIDGE NOT INITIALIZE"); return; }
         if (isMobile)    bridge.send("VKWebAppShowLeaderBoardBox", {user_result : level});
         else bridge.send("VKWebAppCallAPIMethod", { "method": "secure.addAppEvent", "params": { "user_id": ID, "activity_id": "1", "value" : level, "v":"5.131", "access_token": service}});
      }  
   };

   window.logEventFirebase = function(eventName, eventValue){
      
   };

}

function okPlatformInit(){
   console.log('Ok SDK initialized');
}

function kongrPlatformInit(){
   console.log('kongr SDK initialized');
   kongregateAPI.loadAPI(function(){
      window.kongregate = kongregateAPI.getAPI();
      window.kongregate.

      window.showInterstitialAd = function(){
         
      };
   
      window.showRewardedAd = function(){
         
      };
   
      window.saveProgress = function(strings){
         
      };
   
      window.getProgress = function(){
         
      };
   
      window.inviteFriends = function(){
         
      };
   
      window.wallPost = function (str){
         
      };
      
      window.showLeaderBox = function (level){
         
      };

      window.logEventFirebase = function(eventName, eventValue){
         kongregate.analytics.addEvent(eventName, { 
            prop_name: eventValue, 
            another_prop: "null"
          });
      };

      window.onItemList = function (result){
         console.log("Item list result, success: " + result.success);
         if(result.success) {
           for(var i = 0; i < result.data.length; i++) {
             var item = result.data[i];
             console.log((i+1) + ". " + item.identifier + ", " + 
                         item.id + "," + item.name);
           }
         }
       };
      window.checkPurchases = function() {
         kongregate.mtx.requestItemList([], onItemList);
      };

      window.tryToPurchase = function(){

      };

      window.log(kongregate.mtx.purchaseItems);

    });
}

function initPlatform(webGlPlatform){
   if (platform != 'null') return;
   if (webGlPlatform == 'null') return;
   platform = webGlPlatform;
   console.log("Try init: " + webGlPlatform);

   switch(platform){
      case 'Yandex':{
         var script = document.createElement('script');
         script.type = "text/javascript";
         script.src = 'https://yandex.ru/games/sdk/v2';
         script.onload = function() {
            yandexPlatformInit();
         }
         document.body.append(script);
         break;
      }
      case 'Vk':{
         var script = document.createElement('script');
         script.type = "text/javascript";
         script.src = 'https://cdn.jsdelivr.net/npm/@vkontakte/vk-bridge@2.0.8/dist/index.umd.js';
         script.onload = function() {
            vkPlatformInit();
         }
         document.body.append(script);
         break;
      }
      case 'Kongr':{
         var script = document.createElement('script');
         script.type = "text/javascript";
         script.src = 'https://cdn1.kongregate.com/javascripts/kongregate_api.js';
         script.onload = function() {
            kongrPlatformInit();
         }
         document.body.append(script);
         break;
      }
      case 'Ok':{
         okPlatformInit();
         break;
      }
   }
}

function showRewardAdsUnity(){
   if (platform == 'Vk'){
      if (service == '') { console.log("VK BRIDGE NOT INITIALIZE"); return; }
      bridge.send("VKWebAppShowNativeAds", {"ad_format": "reward"}).then(function(data){ if (data.result == true) window.unityInstance.SendMessage('Singlton', 'MoneyAdd'); });
   }
   else if (platform == 'Yandex'){
      if (window.ysdk == null) { console.log("ysdk not inited"); return; }
      window.ysdk.adv.showRewardedVideo({
         callbacks: {
             onRewarded: () => {
               window.unityInstance.SendMessage('Singlton', 'MoneyAdd');
             },
             onError: (e) => {
               console.log('Error while open video ad:', e);
             }
         }
     });
   }
}