import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";

const google_client_id= "514204559844-tjvcuhrsfstkl4uhmql88fa40bsp36o4.apps.googleusercontent.com";
const google_client_secret= "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";

passport.use(new GoogleStrategy ({
    authorizationURL: 'https://www.example.com/oauth2/authorize',
    tokenURL: 'https://www.example.com/oauth2/token',
    clientID: google_client_id,
    clientSecret: google_client_secret,
    callbackURL: "http://localhost:8080/google/callback",
  },
  function(accessToken, refreshToken, profile, done) {
   return done(err, profile);
  }
));

passport.serializeUser ((user,done) => {
    done (null, user);
})

passport.deserializeUser ((user,done) => {
    done (null, user);
})

