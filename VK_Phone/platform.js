let platform = 'null';
let isMobile = false;
let bridge, service = '', ID = 0;

function yandexPlatformInit(){
   console.log('Yandex SDK initialize....');
   YaGames.init().then(ysdk => {
      window.ysdk = ysdk;
      console.log('Yandex SDK initialized');
      initPlayer();
      });
}

function vkPlatformInit(){
   console.log('Vk SDK initialize....');
   bridge = vkBridge.default;
   bridge.send("VKWebAppInit", {});
   service = "013fc4a9013fc4a9013fc4a93e01467d360013f013fc4a96054f82ad37e5f15f0c238c3";
   ID = 0;
   bridge.send("VKWebAppGetUserInfo").then(function(dat){ ID = dat.id; });
   console.log('Vk SDK initialized, user id is ' + ID);
}

function okPlatformInit(){
   console.log('Ok SDK initialized');
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
      case 'Ok':{
         okPlatformInit();
         break;
      }
   }
}

function showInterstitialAd(){
   switch(platform){
      case 'Yandex':{
         if (window.ysdk == null) { console.log("ysdk not inited"); return; }
         window.ysdk.adv.showFullscreenAdv({
            callbacks: {
               onError: (e) => {
                  window.unityInstance.SendMessage('Singlton', 'EnableSound');
                },
                onClose: (e) => {
                  window.unityInstance.SendMessage('Singlton', 'EnableSound');
                }
            }
        });
         break;
      }
      case 'Vk':{
         if (service == '') { console.log("VK BRIDGE NOT INITIALIZE"); return; }
         bridge.send("VKWebAppShowNativeAds", {ad_format:"interstitial"}).then(function(data){ if (data.result == true) window.unityInstance.SendMessage('Singlton', 'MoneyAdd'); else window.unityInstance.SendMessage('Singlton', 'EnableSound'); });
      }
   }
   console.log("try to show interstitial ad");
}

function showRewardedAd(){
   switch(platform){
      case 'Yandex':{
         if (window.ysdk == null) { console.log("ysdk not inited"); return; }
         window.ysdk.adv.showRewardedVideo({
            callbacks: {
                onOpen: () => {
                  console.log('Video ad open.');
                },
                onRewarded: () => {
                  window.rewardedAdShownCallback();
                },
                onError: (e) => {
                  window.unityInstance.SendMessage('Singlton', 'EnableSound');
                },
                onClose: (e) => {
                  window.unityInstance.SendMessage('Singlton', 'EnableSound');
                }
            }
        });
         break;
      }
      case 'Vk':{
         if (service == '') { console.log("VK BRIDGE NOT INITIALIZE"); return; }
         bridge.send("VKWebAppCheckNativeAds", {"ad_format": "reward"}).then(function(data){ if (data.result == true) window.unityInstance.SendMessage('Singlton', 'MoneyAdd'); else window.unityInstance.SendMessage('Singlton', 'EnableSound'); });
      }
   }
   console.log("try to show rewarded ad");
}

function inviteFriends(){
   if (platform == "Vk"){
      if (service == '') { console.log("VK BRIDGE NOT INITIALIZE"); return; }
      if (isMobile)
      bridge.send("VKWebAppShare", {"link": "https://vk.com/app7977375"});
      else
      VK.callMethod("showInviteBox");
   }
}

function wallPost(str){
   if (platform == "Vk"){
      if (service == '') { console.log("VK BRIDGE NOT INITIALIZE"); return; }
      bridge.send("VKWebAppShowWallPostBox", {"message": Pointer_stringify(str), "attachments" : "https://vk.com/app7977375", "v":"5.73"});
   }
}

function showLeaderBox(level){
   if (platform == 'Vk'){
      if (service == '') { console.log("VK BRIDGE NOT INITIALIZE"); return; }
      if (isMobile)    bridge.send("VKWebAppShowLeaderBoardBox", {user_result : level});
      else bridge.send("VKWebAppCallAPIMethod", { "method": "secure.addAppEvent", "params": { "user_id": ID, "activity_id": "1", "value" : level, "v":"5.131", "access_token": service}});
   }  
}

function saveProgress(level, coins){
   if (platform == 'Vk'){
     // if (service == '') { console.log("VK BRIDGE NOT INITIALIZE"); return; }
     // bridge.send("VKWebAppCallAPIMethod", { "method": "secure.addAppEvent", "params": { "user_id": ID, "activity_id": "1", "value" : level, "v":"5.131", "access_token": service}});
   }
   else if (platform == "Yandex"){
      if (window.player == null) {
         console.log("player is null");
         return;
      }
      if (window.player.getMode() === "lite"){
         console.log("player is lite");
         //ysdk.auth.openAuthDialog().then(() => {
            // Игрок успешно авторизован
           // initPlayer().catch(err => {
                // Ошибка при инициализации объекта Player.
          //  });
        //}).catch(() => {
            // Игрок не авторизован.
        //});
        return;
      }
      window.player.setStats({ "level": level, "coins": coins });
      console.log("stats saved: " + level + " " + coins);
   }
}

function secureAppEvent(l){
   
}

function SecureAppEvent(l){
   
}

function getProgress(){
   if (platform == "Yandex"){
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
         var str = "";
         str += stats['level'];
         str += ";";
         str += stats['coins'];
         window.unityInstance.SendMessage('Singlton', 'GetProgress', str);
         console.log("progress sended to unity game");
      });
   }
}

function initPlayer(){
   console.log("try init player");
   if (platform == 'Yandex'){
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
   }
}

function showRewardAdsUnity(){
   if (platform == 'Vk'){
      if (service == '') { console.log("VK BRIDGE NOT INITIALIZE"); return; }
      bridge.send("VKWebAppShowNativeAds", {"ad_format": "reward"}).then(function(data){ if (data.result == true) window.unityInstance.SendMessage('Singlton', 'MoneyAdd'); else window.unityInstance.SendMessage('Singlton', 'EnableSound'); });
   }
   else if (platform == 'Yandex'){
      if (window.ysdk == null) { console.log("ysdk not inited"); return; }
      window.ysdk.adv.showRewardedVideo({
         callbacks: {
             onRewarded: () => {
               window.unityInstance.SendMessage('Singlton', 'MoneyAdd');
             },
             onError: (e) => {
               window.unityInstance.SendMessage('Singlton', 'EnableSound');
             },
             onClose: (e) => {
               window.unityInstance.SendMessage('Singlton', 'EnableSound');
             }
         }
     });
   }
}

initPlatform('Vk');