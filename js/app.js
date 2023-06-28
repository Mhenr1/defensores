var shuffleActive = false;
var locked = true;
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

    ],
    id: "TeamIchigo",
    results: []
}
var modelByakuya = {
    teams: [
        ["Byakuya 1", "Byakuya 2"],
        ["Byakuya 3", "Byakuya 4"],
        ["Byakuya 5", "Byakuya 6"],
        ["Byakuya 7", "Byakuya 8"],
        ["Byakuya 9", "Byakuya 10"],
        ["Byakuya 11", "Byakuya 12"],
        ["Byakuya 13", "Byakuya 14"],
        ["Byakuya 15", "Byakuya 16"],

    ],
    id: "TeamByakuya",
    results: []


}
var modelFinal = {
    teams: [["", ""], ["", ""]],
    results: [
        [

        ],
        ,
    ]
}
var TeamIchigo = JSON.parse(localStorage.getItem("TeamIchigo")) || modelIchigo
var TeamByakuya = JSON.parse(localStorage.getItem("TeamByakuya")) || modelByakuya
var final = JSON.parse(localStorage.getItem("final")) || modelFinal

function save(data, userData) {
    window[userData] = data
    localStorage.setItem(userData, JSON.stringify(data));
    if (userData != "final") {
        let k = "TeamByakuya" == userData ? 1 : 0;
        let result = observe(data)
        if (result !== false) {
            final.teams[k] = result
            console.log(final.results[0][k], k)
            final.results[0][k] = [1, 0]
            console.log(final.results[0][k])

        } else {
            final.teams[k] = ["",""]
            final.results[0][k] = [0, 0]

        }

        initTournament()
    }

}

function edit(container, data, doneCb) {
    var input = $('<input type="text">')
    input.val(data)
    input.blur(function () { doneCb(input.val()) })
    input.keyup(function (e) { if ((e.keyCode || e.which) === 13) input.blur() })
    container.html(input)
    input.focus()
}


function render(container, data, score, state) {
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
var disableTeamEdit = localStorage.getItem("disableTeamEdit") || false
disableTeamEdit = eval(disableTeamEdit)

var initTournament = function () {
    var conf = {
        skipConsolationRound: true,
        disableToolbar: true,
        teamWidth: 100,
        save,
        disableScoring: true,
        disableTeamEdit,
        centerConnectors: true,
        roundMargin: 20,

        decorator: {
            edit,
            render
        }

    }
    $('#tournamentA').bracket({
        init: TeamIchigo /* data to initialize the bracket with */,
        ...conf,
        userData: "TeamIchigo"
    })

    $('#tournamentB').bracket({
        init: TeamByakuya, // data to initialize the bracket with
        dir: 'rl',
        ...conf,
        userData: "TeamByakuya"

    })
    $('#final').bracket({
        init: final,
        ...conf,
        skipConsolationRound: false,
        userData: "final"

    })
}
function shuffle() {
    if (shuffleActive || locked) {
        return;
    }
    shuffleActive = true;
    disableTeamEdit = true


    localStorage.setItem("disableTeamEdit", true)
    let array = [];
    TeamIchigo.teams.forEach(e => {
        array.push(...e)

    });
    TeamByakuya.teams.forEach(e => {
        array.push(...e)

    });


    TeamIchigo.teams = TeamByakuya.teams = []

    var aux = []
    array.sort(function (a, b) { return 0.5 - Math.random() });

    do {
        aux.push([array.shift(), array.shift()])


    } while (array.length);
    TeamIchigo.teams = aux.slice(0, 8)
    TeamByakuya.teams = aux.slice(8)
    TeamIchigo.results = []
    TeamByakuya.results = []


    transition()



}


function transition() {

    $('#content').addClass('animate_content');
    setTimeout(() => {
        $('#content').removeClass('animate_content')
        shuffleActive = false
    }, 1000)

    setTimeout(function () {

        lockname()
        $('#tournamentA .label').first().trigger("save")
        $('#tournamentB .label').first().trigger("save")

    }, 501);


}

function lockname() {
    disableTeamEdit = true
    $('body').removeClass('editActive')
    initTournament()

}
function setName() {
    if (locked) return;
    disableTeamEdit = !disableTeamEdit
    $('body').toggleClass('editActive')
    initTournament()

}
function reset() {
    if (shuffleActive || locked) return;
    TeamByakuya = modelByakuya
    TeamIchigo = modelIchigo
    final = modelFinal
    transition()


}
function lock(e) {
    let newText = 'lock_open'

    locked = !locked
    if (locked) {
        newText = 'lock'
        $(e).parent().removeClass('unlock')
        lockname()
    } else {
        $(e).parent().addClass('unlock')
    }
    $(e).text(newText)
}
$(document).mousemove(function (event) {


    $("#follow").offset({ top: event.pageY + 5, left: event.pageX + 5 })

});
function observe(team) {
    var e = 3
    var j = 0
    var j1 = 0
    var teamAux = JSON.parse(JSON.stringify(team.results[0]));
    teamAux[e][j1].reverse()
    while (e > 0) {
        var k = team.results[0][e][j].findIndex(i => i == 1)
        var k1 = teamAux[e][j1].findIndex(i => i == 1)
        if (k == -1) return false;
        j1 = (2 * j1) + k1
        j = (2 * j) + k

        e--

    } 
    k = team.results[0][e][j].findIndex(i => i == 1)
    k1 = teamAux[e][j1].findIndex(i => i == 1)

    var semiFinal = [
        team.teams[j][k],
        team.teams[j1][k1]
    ];

    return semiFinal
}


