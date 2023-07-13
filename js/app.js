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
var TeamIchigo = JSON.parse(localStorage.getItem("TeamIchigo")) ?? modelIchigo
var date = localStorage.getItem("date") ?? $("p.date").text()

$("p.date").text(date)
$("p.date").attr("data-text", date)

function save(data, userData) {
    window[userData] = data
    localStorage.setItem(userData, JSON.stringify(data));

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
    kon(1)
    $('#content').addClass('animate_content');
    $('.animate_content .team').first().one("transitionend webkitTransitionEnd oTransitionEnd", () => {
        lockandInit()

        $('#content').addClass('animate_content_flip')
        $('.tournament').trigger("save")
        shuffleActive = false
        $('.animate_content_flip .team').first().one("transitionend webkitTransitionEnd oTransitionEnd", () => {
            $('#content').removeClass('animate_content_flip')
            $('#content').removeClass('animate_content')
        })
    })


}
$('p.date').on("input", () => {
    date = $("p.date").text()
    $("p.date").attr("data-text", date)
    localStorage.setItem("date", date);


})
function lockandInit() {
    let left = window.scrollX || document.documentElement.scrollLeft;

    disableTeamEdit = true
    $('.overlayer').removeClass('editActive')
    $('p.date').attr('contenteditable', 'false')


    initTournament()
    document.documentElement.scrollLeft = left

}
function setName() {
    if (locked) return;
    disableTeamEdit = false
    $('.overlayer').addClass('editActive')
    $('p.date').attr('contenteditable', 'true');
    $('p.date').focus()
    initTournament()

}
function editName() {
    disableTeamEdit ? setName() : lockandInit();

}
function resetMatches() {

    if (shuffleActive || locked) return;


    shuffleActive = true
    TeamIchigo = modelIchigo
    closePopUp()
    transition()



}
var lock = function () {

    let newText = 'lock_open'

    locked = !locked
    if (locked) {
        newText = 'lock'
        $(this).parent().removeClass('unlock')
        lockandInit()
    } else {
        $(this).parent().addClass('unlock')

    }
    $(this).text(newText)
}

var closePopUp = function () {
    $('#pop-up').css({ display: "none" })
    $("#pop-up .container").css({ display: "none" })
    $('body').removeClass("offScroll")

}
var popUp = function (fn) {
    $('#pop-up').css({ display: "flex" })
    $(`.container.${fn.data.action}`).css({ display: "block" })
    $('body').addClass("offScroll")
}

$("#lock").on("click", lock)
$("span.shuffle").on("click", { action: "shuffle" }, popUp)
$("span.reset").on("click", { action: "reset" }, popUp)
$("span.edit").on("click", editName)
$("#pop-up .cancel").on("click", closePopUp)
$("#pop-up .shuffle .confirm").on("click", shuffle)
$("#pop-up .reset .confirm").on("click", resetMatches)

$(document).ready(initTournament)
var kon = function (n) {

    if (n == 9) {

        $(".kon").hide(1000)

        return;
    }

    $(".kon").find("img").attr('src', `../img/kon/anime_kon_${n}.png`)
    $(".kon").show()
    let final = shuffleActive ? 2 : 9;
    n >= final ? n = 1 : n++;

    setTimeout(() => {
        kon(n)
    }, 200)

}