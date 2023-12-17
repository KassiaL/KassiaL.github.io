let platform = 'null';

function yandexPlatformInit(){
   console.log('Yandex SDK initialize....');
   YaGames.init().then(ysdk => {
      window.ysdk = ysdk;
      console.log('Yandex SDK initialized');
      });
}

function vkPlatformInit(){
   console.log('Vk SDK initialized');
}

function okPlatformInit(){
   console.log('Ok SDK initialized');
}

function initPlatform(webGlPlatform){
   platform = webGlPlatform;
   console.log("Try init: " + webGlPlatform);

   switch(platform){
      case 'Yandex':{
         var script = document.createElement('script');
         script.src = 'https://yandex.ru/games/sdk/v2';
         script.onreadystatechange = function() {
            if (this.readyState == 'complete') {
                yandexPlatformInit();
            }
         }
         document.body.append(script);
         break;
      }
      case 'Vk':{
         vkPlatformInit();
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
                onClose: function(wasShown) {
                  console.log("InterstitalAd wasShown: " + wasShown);
                },
                onError: function(error) {
                  console.log("InterstitalAd error: " + error);
                }
            }
        });
         break;
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
                onClose: () => {
                  console.log('Video ad closed.');
                }, 
                onError: (e) => {
                  console.log('Error while open video ad:', e);
                }
            }
        });
         break;
      }
   }
   console.log("try to show rewarded ad");
}