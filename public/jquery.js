
const API_URL = "http://localhost:4000/api/"


$(document).ready(() => {
  loadData()
  $('#myModal').on('show.bs.modal', function (e) {
    console.log('ok')
    if (!data) {
      return e.preventDefault() // stops modal from being shown
    }
  })
  $('#form-siswa').submit((event) => {
    event.preventDefault()
    let string = $('#string').val()
    let integer = $('#integer').val()
    let float = $('#float').val()
    let date = $('#date').val()
    let bool = $('#boolean').val()

    addData({ string, integer, float, date, bool })

  })
  $("table tbody").on("click", ".btn-delete", function () {
  deleteData($(this).attr("dataId"));
  });
})

const loadData = () => {
  $.ajax({
    method: "GET",
    url: `${API_URL}bread`,

  })
    .done(function (data) {
      let html = ""
      data.forEach(e => {
        html += `<tr>
                <th scope="row">${e.bread_id}</th>
                <td> ${e.string_data}</td>
                <td>${e.integer_data}</td>
                <td>${e.float_data}</td>
                <td>${moment(e.date_data).format('YYYY-MM-DD')}</td>
                <td>${e.boolean_data}</td>
                <td>
                <button type="button" class="btn btn-success" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">edit</button> 
                  <button type ="button" class="btn btn-danger btn-delete" dataId="${e.bread_id}">delete</button>
                </td>
                
              </tr>`

      });
      $("table tbody").html(html)
    }).fail(function (jqXHR, textStatus) {
      alert("Request failed: " + textStatus);
    });
}


const addData = (randomType) => {
  $.ajax({
    method: "POST",
    url: `${API_URL}bread`,
    data: randomType

  }).done(function (data) {
    console.log("good")
    loadData()
    $('#string').val('')
    $('#integer').val('')
    $('#float').val('')
    $('#date').val('')
    $('#boolean').val('')
  }).fail(function (jqXHR, textStatus) {
    alert("Request failed: " + textStatus);
  });
}

const deleteData = (id) => {
  $.ajax({
    method: "DELETE",
    url: `${API_URL}bread/${id}`,
    

  }).done(function (data) {
    console.log("good")
    loadData()
   
  }).fail(function (jqXHR, textStatus) {
    alert("Request failed: " + textStatus);
  });
}