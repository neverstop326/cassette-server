

$(document).ready(function () {
    /*
    - get a reference to the 'cassette_list' UL element
    - do a GET request to the server /cassettes URL
    - IF the get request succeeds, then:
        for each cassette in the cassetteList:
            append a LI containing the cassette title.
      OTHERWISE (our get request failed for some reason, bummer..)
        Append an error messsage to the cassette-list UL element

    Once that works, update the express server to get the data from mongo...
    */
    var cassette_list = $("#cassette_list");  // aka document.getElementById

    function deleteHandler(e) {
        /*
        To delete something...
        - [x] we need to make the API call
        - [ ] IF it succeeds, we need to remove the item from the DOM
            - otherwise...
            - we need to show an error message
        */
        var title = e.target.value;
        $.ajax({
            url: '/api/cassettes',
            type: 'DELETE',
            data: {_id: e.target.id, title: title},
        }).done(function (data, status, req) {
            console.log(data);
            $(data._id)
            var _id = data._id;
            $(`#${_id}`).parent().remove();
        }).fail(function (req, status, err) {
            alert(`Oh uh! Something went wrong. Got status: ${status}\nwith error: ${err}`);
        })         
    }

    function buildListItem(title, _id) {
        _id = _id || 'temporary-list-item-id';
        cassette_list.append(`<li id='li-${_id}'>${title} </li>`);
        var button = document.createElement('button');
        button.id = _id;
        button.name = `${title}`;
        button.value = `${title}`;
        button.addEventListener('click', deleteHandler);
        button.innerText = 'X';
        $(`#li-${_id}`).append(button);        
    }

    var data = $.get('/api/cassettes').done(function(data){
        // ToDo: refactor this to use buildListItem!
        for (cassette of data.cassettesList) {
            // Note !! Two different ways to create HTML elements
            // One: use jQuery, eg, the append method here:
            var _id = cassette._id;
            cassette_list.append(`<li id='li-${_id}'>${cassette.title}
                <p>${cassette.description || ''}</p></li>`);

            // Two: use vanilla JS, eg, the document.createElement method here:
            var button = document.createElement('button');
            button.id = _id;
            button.name = `${cassette.title}`;
            button.value = `${cassette.title}`;
            button.addEventListener('click', deleteHandler);
            button.innerText = 'X';

            // Then, here, I can use jQuery to append a vanilla JS html element.
            $(`#li-${_id}`).append(button);
        }
    }).fail(function (err){
        alert(`Uh oh! Something went wrong, got: ${err}`);
    })


    
    // Setup data posting with AJAX:
    // Note, here we use jQuery's on method, rather than `addEventListener`
    // If we do it this way, we also need to clear the submit field, add the item to the
    // collection list, and, ideally, get 

    var submit = $('#submit').on('click', function(e){
        var input = $("#add_cassette");
        var description = $("#add_description");
        $.post(
            '/api/cassettes', 
            {
                add_cassette: input.val(),
                description: description.val()

            }
        ).done(function (data, status, req) {
            console.log(`Added: ${input.val()} to the collection!`);
            buildListItem(input.val());
            input.val('');
        }
        ).fail(function (req, status, err) {
            alert(`Oh uh! Something went wrong. Got status: ${status}\nwith error: ${err}`);
        })
    })
    
})
