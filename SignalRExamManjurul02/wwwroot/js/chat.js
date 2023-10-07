// The following sample code uses modern ECMAScript 6 features 
// that aren't supported in Internet Explorer 11.
// To convert the sample for environments that do not support ECMAScript 6, 
// such as Internet Explorer 11, use a transpiler such as 
// Babel at http://babeljs.io/. 
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chatHub")
    .build();

connection.on("Send", function (message) {
    $("#messagesList").append(`<li>${message}</li>`);
});
connection.on("ReceiveMessage", (u, m) => {
    $("#messagesList").append(`<li><span class="active">${u}</span>: ${m}</li>`);
});
connection.on("LeaveGroupMessage", function (message) {
    $("#messagesList").append(`<li>${message}</li>`);
});


document.getElementById("groupmsg").addEventListener("click", async (event) => {
    var groupName = document.getElementById("group-name").value;
    var userName = document.getElementById("user-name").value;
    var groupMsg = document.getElementById("group-message-text").value;
    try {
        await connection.invoke("SendMessageToGroup", groupName, groupMsg, userName);
    }
    catch (e) {
        console.error(e.toString());
    }
    event.preventDefault();
});

document.getElementById("join-group").addEventListener("click", async (event) => {
    var groupName = document.getElementById("group-name").value;
    var userName = document.getElementById("user-name").value;
    try {
        await connection.invoke("AddToGroup", groupName, userName);

    }
    catch (e) {
        console.error(e.toString());
    }
    event.preventDefault();
});



document.getElementById("leave-group").addEventListener("click", async (event) => {
    var groupName = document.getElementById("group-name").value;
    var userName = document.getElementById("user-name").value;
    try {
        await connection.invoke("RemoveFromGroup", groupName, userName);
    }
    catch (e) {
        console.error(e.toString());
    }
    event.preventDefault();
});




(async () => {
    try {
        await connection.start();

        $('#br').click(() => {
            $("#f").click();
        });

        $('#f').change(() => {
            var fileInput = document.getElementById("f");
            var file = fileInput.files[0];
            var userName = document.getElementById("user-name").value;
            var groupName = document.getElementById("group-name").value;

            if (file) {
                console.log(file.name);
                console.log(file.type);
                var reader = new FileReader();
                reader.onloadend = function () {
                    var data = {
                        filename: file.name,
                        image: reader.result
                    };
                    connection.invoke("Upload", data, userName, groupName);

                    // Clear the input field after successful upload
                    fileInput.value = null;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    catch (e) {
        console.error(e.toString());
    }
})();




