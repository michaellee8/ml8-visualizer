require("firebase-tools").deploy({
    project: "ml8-visualizer",
    token: process.env.FIREBASE_TOKEN,
    cwd: "./"
}).then(function(res) {
    console.log(res, "deploy success")
}).catch(function(err) {
    console.log("deploy error", err)
})
