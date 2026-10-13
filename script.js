const fetchName = document.getElementsByClassName("fetchName")[0];
const fetchButton = document.getElementsByClassName("fetchButton")[0];
const fetchResult = document.getElementsByClassName("fetchResult")[0];
const screenname = document.getElementsByClassName("screenname")[0];
const username = document.getElementsByClassName("username")[0];
const usericon = document.getElementsByClassName("usericon")[0];

fetchButton.addEventListener("click", async () => {
    const fetchingUsername = fetchName.value.trim().replace(/^@/, "");

    if (!/^[A-Za-z0-9_]{1,15}$/.test(fetchingUsername)) {
        fetchResult.textContent = "ユーザー名を正しく入力してください。";
        fetchResult.hidden = true;
        return;
    }

    fetchButton.disabled = true;
    fetchResult.textContent = "取得中...";

    try {
        const url =
          "https://api.fxtwitter.com/2/profile/" +
          encodeURIComponent(fetchingUsername);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("HTTP " + response.status);
        }

        const data = await response.json();
        const user = data.user;

        if (!user || !user.name || !user.avatar_url) {
          throw new Error("プロフィール情報が見つかりません。");
        }

        screenname.textContent = user.name;
        username.textContent = "@" + user.screen_name;
        usericon.src = user.avatar_url;

        usericon.onerror = () => {
          usericon.onerror = null;
          usericon.removeAttribute("src");
          fetchResult.textContent = "取得できましたが、アイコンを表示できません。";
        };

        fetchResult.textContent = "取得しました。";
    } catch (error) {
        fetchResult.textContent =
          "取得失敗: " + error.message +
          "（CORS・通信制限・ユーザー名をご確認ください）";
    } finally {
        fetchButton.disabled = false;
    }
});