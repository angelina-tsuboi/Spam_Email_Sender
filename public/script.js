

$(window).on("load", () => {
    $("#spinner").fadeOut("slow");
})

$("#v-pills-profile-tab").on("click", () => {
    Mail.find({}, (err, data) => {
        err ? console.log(err) : console.log(data)
    })
})