
const API_URL = "http://localhost:4000/api/"


$(document).ready(() => {
  loadData()


  $('#change').submit((event) => {
    
    event.preventDefault()
    let bread_id=$('#inputId').val()
    let string = $('#inputString').val()
    let integer = $('#inputInteger').val()
    let float = $('#inputFloat').val()
    let date = $('#inputDate').val()
    let bool = $('#inputBool').val()
    if ($(document.activeElement).attr('id') === "saveBtn") {
      addData({ string, integer, float, date, bool })
    } else {
      console.log("edit button work")
      editData({ bread_id,string, integer, float, date, bool })
    }
   
  })

  $(".btn-add").click(function () {
    $(".btn-add-user").show()
    $(".btn-edit-user").hide()
    $(".edit-row").hide()
  })
  $("table tbody").on("click", ".btn-edit", function () {
    console.log($(this).attr("dataId"))
    let setId=$(this).attr("dataId")
    console.log(typeof setId)
    $(".btn-edit-user").show()
    $(".btn-add-user").hide()
    $(".edit-row").show()
    $("#inputId").val(setId)
    // value="${$(".btn-edit").attr("dataId")}" 
    // let html =
    // $(".modal-body").prepend(html)
  });
  $("table tbody").on("click", ".btn-delete", function () {
    deleteData($(this).attr("dataId"));
  });


  // $(".btn-add").on("click",function(){
  //   console.log(this)
  // })
  // $(".btn-add").click(function(){
  //   // console.log(this)
  //   $("#form-popUp").modal('show')
  // })
  $(".btn-search").on("click", function () {
    console.log(this)
  })
  $('#saveBtn').click(function () {
    $('#form-popUp').modal('hide');
  });
  $('#updtBtn').click(function () {
    $('#form-popUp').modal('hide');
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
                <button type="button" class="btn btn-success btn-edit" data-toggle="modal" data-target="#form-popUp" dataId=${e.bread_id}>edit</button> 
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
    $('#inputString').val('')
    $('#inputInteger').val('')
    $('#inputFloat').val('')
    $('#inputDate').val('')
    $('#inputBool').val('')
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

const editData = (randomType) => {
  $.ajax({
    method: "PUT",
    url: `${API_URL}bread/${randomType.bread_id}`,
    data:randomType


  }).done(function (data) {
    console.log("good")
    loadData()

  }).fail(function (jqXHR, textStatus) {
    alert("Request failed: " + textStatus);
  });
}