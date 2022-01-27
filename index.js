window.addEventListener("load", event => {

    namecolorlabel.style.backgroundColor = namecolor.value;
    txtcolorlabel.style.backgroundColor = txtcolor.value;
    messagecolorlabel.style.backgroundColor = messagecolor.value;

    namecolor.addEventListener("change", () => {
        namecolorlabel.style.backgroundColor = namecolor.value;
    });

    txtcolor.addEventListener("change", () => {
        txtcolorlabel.style.backgroundColor = txtcolor.value;
    });

    messagecolor.addEventListener("change", () => {
        messagecolorlabel.style.backgroundColor = messagecolor.value;
    });

});
