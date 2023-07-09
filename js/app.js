var shuffleActive = false;
var locked = true;
var disableTeamEdit = true
disableTeamEdit = eval(disableTeamEdit)
var modelIchigo = {
    teams: [
        ["Ichigo 1", "Ichigo 2"],
        ["Ichigo 3", "Ichigo 4"],
        ["Ichigo 5", "Ichigo 6"],
        ["Ichigo 7", "Ichigo 8"],
        ["Ichigo 9", "Ichigo 10"],
        ["Ichigo 11", "Ichigo 12"],
        ["Ichigo 13", "Ichigo 14"],
        ["Ichigo 15", "Ichigo 16"],
        ["Byakuya 1", "Byakuya 2"],
        ["Byakuya 3", "Byakuya 4"],
        ["Byakuya 5", "Byakuya 6"],
        ["Byakuya 7", "Byakuya 8"],
        ["Byakuya 9", "Byakuya 10"],
        ["Byakuya 11", "Byakuya 12"],
        ["Byakuya 13", "Byakuya 14"],
        ["Byakuya 15", "Byakuya 16"],

    ],
    id: "TeamIchigo",
    results: []
}
var TeamIchigo = JSON.parse(localStorage.getItem("TeamIchigo")) || modelIchigo


function save(data, userData) {
    window[userData] = data
    localStorage.setItem(userData, JSON.stringify(data));

    if (userData != "final") return
    initObserve(userData, data);

}

function edit(container, data, doneCb) {
    var input = $('<input type="text">')
    input.val(data)
    input.blur(function () { doneCb(input.val()) })
    input.keyup(function (e) { if ((e.keyCode || e.which) === 13) input.blur() })
    container.html(input)
    input.focus()
}


function render(container, data, _score, state) {
    switch (state) {
        case "empty-bye":
            container.append("Jogador")
            return;
        case "empty-tbd":
            container.append("Aguardando")
            return;

        case "entry-no-score":
        case "entry-default-win":
        case "entry-complete":
            container.append(data)
            return;
    }
}

var initTournament = function () {
    var conf = {
        skipConsolationRound: false,
        disableToolbar: true,
        teamWidth: 100,
        save,
        isSingleElimination: false,
        disableScoring: true,
        disableTeamEdit,
        centerConnectors: true,
        roundMargin: 30,
        twoBrackets: true,
        decorator: {
            edit,
            render
        }

    }
    $('.tournament').bracket({
        init: TeamIchigo,
        ...conf,
        userData: "TeamIchigo"
    })


}
function shuffle() {
    if (shuffleActive || locked) {
        return;
    }



    shuffleActive = true;
    disableTeamEdit = true
    let array = [];
    TeamIchigo.teams.forEach(e => {
        array.push(...e)

    });

    TeamIchigo.teams = []

    array.sort(function (a, b) { return 0.5 - Math.random() });

    do {
        TeamIchigo.teams.push([array.shift(), array.shift()])

    } while (array.length);

    TeamIchigo.results = []
    closePopUp()
    transition()

}


function transition() {

    $('#content').addClass('animate_content');
    setTimeout(() => {
        lockname()
        $('#content').removeClass('animate_content')
        shuffleActive = false
        setTimeout(() => {

            $('.tournament .label').first().trigger("save")


        }, 500);

    }, 1600)

}

function lockname() {
    disableTeamEdit = true
    $('.all').removeClass('editActive')

    initTournament()

}
function setName() {
    if (locked) return;
    disableTeamEdit = false
    $('.all').addClass('editActive')

    initTournament()

}
function editName() {
    disableTeamEdit ? setName() : lockname();

}
function resetMatches() {

    if (shuffleActive || locked) return;


    shuffleActive = true
    TeamIchigo = modelIchigo
    closePopUp()
    transition()



}
function lock() {

    let newText = 'lock_open'

    locked = !locked
    if (locked) {
        newText = 'lock'
        $(this).parent().removeClass('unlock')

        lockname()
    } else {
        $(this).parent().addClass('unlock')

    }
    $(this).text(newText)
}
initTournament()
var closePopUp = function () {
    $('#pop-up').css({ display: "none" })
    $("#pop-up .container").css({ display: "none" })
    $('body').removeClass("offScroll")

}
var popUp = function (fn) {

    $('#pop-up').css({ display: "flex" })
    $(`.container.${fn}`).css({ display: "block" })
    $('body').addClass("offScroll")
}

$("#lock").on("click", lock)
$("span.shuffle").on("click", () => {
    popUp("shuffle")
})
$("span.reset").on("click", () => {
    popUp("reset")
})
$("span.edit").on("click", editName)

$("#pop-up .cancel").on("click", closePopUp)
$("#pop-up .shuffle .confirm").on("click", shuffle)
$("#pop-up .reset .confirm").on("click", resetMatches)

