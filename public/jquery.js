
const API_URL = "http://localhost:4000/api/"


$(document).ready(() => {
  let browseArr = []
  //load all data
  loadData()


  //for Add and Edit Fitur
  $('#change').submit((event) => {
    console.log("it in herer")
    event.preventDefault()
    let bread_id = $('#inputId').val()
    let string = $('#inputString').val()
    let integer = $('#inputInteger').val()
    let float = $('#inputFloat').val()
    let date = $('#inputDate').val()
    let bool = $('#inputBool').val()
    if ($(document.activeElement).attr('id') === "saveBtn") {
      addData({ string, integer, float, date, bool })
    } else {
      editData({ bread_id, string, integer, float, date, bool })
    }

  })

  //to hide and show button Add and Edit in the modals
  $(".btn-add").click(function () {
    $(".btn-add-user").show()
    $(".btn-edit-user").hide()
    $(".edit-row").hide()
  })
  $("table tbody").on("click", ".btn-edit", function () {
    console.log($(this).attr("dataId"))
    let setId = $(this).attr("dataId")
    console.log(typeof setId)
    $(".btn-edit-user").show()
    $(".btn-add-user").hide()
    $(".edit-row").show()
    $("#inputId").val(setId)

  });
  //to delete row
  $("table tbody").on("click", ".btn-delete", function () {
    deleteData($(this).attr("dataId"));
  });


  //to make modals dissapear after click Save or Update button
  $('#saveBtn').click(function () {
    $('#form-popUp').modal('hide');
  });
  $('#updtBtn').click(function () {
    $('#form-popUp').modal('hide');
  });

  //pagination
  $("ul.pagination").on("click", "#pagination", function (event) {
    let page = $(this).val()

    loadData({ page })
    $(`li.pg${page}`).addClass("active")

  })

  //targetting all stuff that needed for make browse fitur
  $(".checkboxId").click(function () {
    console.log($(this).val())
    console.log($("#id").val())
  })
  $(".btn-search").click(function (event) {
    event.preventDefault()
    console.log(this)
    if ($(".checkboxId").val() === "on" && $("#id").val().length != 0) browseArr.push(`id=${$("#id").val()}`)
    if ($(".checkboxString").val() === "on" && $("#string").val().length != 0) browseArr.push(`string=${$("#string").val()}`)
    if ($(".checkboxInteger").val() === "on" && $("#integer").val().length != 0) browseArr.push(`integer=${$("#integer").val()}`)
    if ($(".checkboxFloat").val() === "on" && $("#float").val().length != 0) browseArr.push(`float=${$("#float").val()}`)
    if ($(".checkboxDate").val() === "on" && $("#startdate").val().length != 0 && $("#enddate").val().length != 0) browseArr.push(`stardate=${$("#startdate").val()}`, `enddate=${$("#enddate").val()}`)
    if ($(".checkboxBool").val() === "on" && $("#boolean").val() != "Choose...") browseArr.push(`bool=${$("#boolean").val()}`)


    if (browseArr.length > 0) {

      browseArr.push('fiturBrowser=yes')
      let queryBrowse = browseArr.join("&")
      console.log(queryBrowse)
      loadData({ queryBrowse })
      browseArr = []

    }
    else {
      loadData()
    }
    $(".checkboxId").prop("checked", false)
    $(".checkboxString").prop("checked", false)
    $(".checkboxInteger").prop("checked", false)
    $(".checkboxFloat").prop("checked", false)
    $(".checkboxDate").prop("checked", false)
    $(".checkboxBool").prop("checked", false)
    $("#id").val("")
    $("#string").val("")
    $("#integer").val("")
    $("#float").val("")
    $("#startdate").val("")
    $("#enddate").val("")
    $("#boolean").val("Choose...")
  })

})


const loadData = (obj) => {
  console.log(obj)
  let request
  if (typeof obj === "undefined") {
    request = { method: "GET", url: `${API_URL}bread` }
  } else if (obj.page) {
    request = { method: "GET", url: `${API_URL}bread?page=${obj.page}` }
  } else if (obj.queryBrowse) {
    request = { method: "GET", url: `${API_URL}bread?${obj.queryBrowse}` }
  }
  // let request = typeof reqPage === "undefined" ? { method: "GET", url: `${API_URL}bread` } : { method: "GET", url: `${API_URL}bread?page=${reqPage}` }
  $.ajax(request)
    .done(function (data) {
      console.log(data)
      let listTypeData = ""
      data.list.forEach(e => {
        listTypeData += `<tr>
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
      $("table tbody").html(listTypeData)
      let maxPage = data.totalPage
      let currentPage = data.currPage
      let paginationButton = ""

      if (currentPage == 1) {
        paginationButton +=
          `<li class="page-item  disabled">
          <button type="submit"  id="pagination" name="page" value="${Number(currentPage) - 1}"
          class="page-link">Previous</button>
      </li>`
      } else {
        paginationButton +=
          `<li class="page-item ">
            <button type="submit"  id="pagination" name="page" value="${Number(currentPage) - 1}"
            class="page-link">Previous</button>
        </li>`
      }
      for (let page = 1; page <= maxPage; page++) {
        if (currentPage == page) {
          paginationButton += `
          <li class="page-item active pg-${page}"> 
            <button type="submit" id="pagination" name="page" value="${page}" class="page-link ">${page}</button>
          </li>`
        } else {
          paginationButton +=
            `<li class="page-item pg-${page}"> 
            <button type="submit" id="pagination" name="page" value="${page}" class="page-link">${page}</button>
          </li>`
        }
      }
      if (currentPage == maxPage) {
        paginationButton += `
        <li class="page-item  disabled ">
            <button type="submit"  id="pagination" name="page" value="${Number(currentPage) + 1}" class="page-link ">Next</button>
        </li>`
      } else {
        paginationButton += `
        <li class="page-item ">
            <button type="submit"  id="pagination" name="page" value="${Number(currentPage) + 1}" class="page-link ">Next</button>
        </li>`
      }
      $("ul.pagination").html(paginationButton)
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
    data: randomType


  }).done(function (data) {
    console.log("good")
    loadData()

  }).fail(function (jqXHR, textStatus) {
    alert("Request failed: " + textStatus);
  });
}