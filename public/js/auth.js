const $form = document.querySelector("form");

const urlLocal = "http://localhost:8080/api/auth/login";
const url = "http://localhost:8080/api/auth/google";

function onSignIn(googleUser) {
   // var profile = googleUser.getBasicProfile();
   // console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
   // console.log("Name: " + profile.getName());
   // console.log("Image URL: " + profile.getImageUrl());
   // console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.

   var id_token = googleUser.getAuthResponse().id_token;

   fetch(url, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token }),
   })
      .then((resp) => resp.json())
      .then(({ token }) => {
         localStorage.setItem("token", token);
         window.location = "chat.html";
      })
      .catch(console.error);
}

function signOut() {
   var auth2 = gapi.auth2.getAuthInstance();
   auth2.signOut().then(function () {
      console.log("User signed out.");
   });
}

$form.addEventListener("submit", (e) => {
   e.preventDefault();

   //    const formData

   const formData = {
      email: $form.email.value,
      password: $form.password.value,
   };

   fetch(urlLocal, {
      method: "post",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
   })
      .then((resp) => resp.json())
      .then(({ msg, token }) => {
         if (msg) return console.error(msg);
         localStorage.setItem("token", token);
         window.location = "chat.html";

         console.log(token);
      })
      .catch(console.error);
});
