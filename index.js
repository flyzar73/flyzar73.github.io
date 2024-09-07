import { DiscordSDK } from "https://esm.run/@discord/embedded-app-sdk";

const discordSdk = new DiscordSDK("1070398623638110319");

setupDiscordSdk().then(() => {
  console.log("Discord SDK is ready");
});

async function setupDiscordSdk() {
  await discordSdk.ready();
  console.log("Discord SDK is ready");

  // Authorize with Discord Client
  const { code } = await discordSdk.commands.authorize({
    client_id: "1070398623638110319",
    response_type: "code",
    state: "",
    prompt: "none",
    scope: ["identify"],
  });

  // Retrieve an access_token from your activity's server
  // Note: We need to prefix our backend `/api/token` route with `/.proxy` to stay compliant with the CSP.
  // Read more about constructing a full URL and using external resources at
  // https://discord.com/developers/docs/activities/development-guides#construct-a-full-url
  const response = await fetch("https://champion-forcibly-teal.ngrok-free.app/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
    }),
  });
  const { access_token } = await response.json();
  console.log(`Access Token: ${access_token}`);

  // Authenticate with Discord client (using the access_token)
  auth = await discordSdk.commands.authenticate({
    access_token,
  });

  console.log(access_token);

  if (auth == null) {
    throw new Error("Authenticate command failed");
  }
}

document.querySelector("#app").innerHTML = `
<div>
  <img src="./rocket.png" class="logo" alt="Discord" />
  <h1>Hello, World! ${access_token}</h1>
</div>
`;
