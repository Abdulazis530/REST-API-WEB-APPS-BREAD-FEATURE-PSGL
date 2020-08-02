
const API_URL = "http://localhost:4000/api/"

let browseArr = []
let queryBrowse
$(document).ready(() => {

  //load all data
  loadData()


  //for Add and Edit Fitur
  $('#change').submit((event) => {

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
    $('#inputString').val('')
    $('#inputInteger').val('')
    $('#inputFloat').val('')
    $('#inputDate').val('')
    $('#inputBool').val("Choose...")
  })

  //to hide and show button Add and Edit in the modals
  $(".btn-add").click(function () {
    $(".btn-add-user").show()
    $(".btn-edit-user").hide()
    $(".edit-row").hide()
  })
  $("table tbody").on("click", ".btn-edit", function () {

    let setId = $(this).attr("dataId")

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

    if (typeof queryBrowse === "undefined") {
      loadData({ page })
    } else {
      loadData({ pageBrowse: page })
    }

    loadData
    $(`li.pg${page}`).addClass("active")

  })

  //targetting all stuff that needed for make browse fitur

  $(".btn-search").click(function (event) {
    event.preventDefault()

    if ($(".checkboxId").prop('checked') === true && $("#id").val().length != 0) browseArr.push(`id=${$("#id").val()}`)
    if ($(".checkboxString").prop('checked') === true && $("#string").val().length != 0) browseArr.push(`string=${$("#string").val()}`)
    if ($(".checkboxInteger").prop('checked') === true && $("#integer").val().length != 0) browseArr.push(`integer=${$("#integer").val()}`)
    if ($(".checkboxFloat").prop('checked') === true && $("#float").val().length != 0) browseArr.push(`float=${$("#float").val()}`)
    if ($(".checkboxDate").prop('checked') === true && $("#startdate").val().length != 0 && $("#enddate").val().length != 0) browseArr.push(`stardate=${$("#startdate").val()}`, `enddate=${$("#enddate").val()}`)
    if ($(".checkboxBool").prop('checked') === true && $("#boolean").val() != "Choose...") browseArr.push(`bool=${$("#boolean").val()}`)

    console.log(browseArr.length)
    console.log(typeof browseArr[0])
    if (browseArr.length > 0) {

      browseArr.push('fiturBrowser=yes')
      queryBrowse = browseArr.join("&")
      // queryForBrowsePagi = queryBrowse
      console.log(`inside of btn search ${queryBrowse}`)
      loadData({ queryBrowse })
      browseArr = []


    }
    else {
      queryBrowse = ""
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

  let request
  if (typeof obj === "undefined") {
    request = { method: "GET", url: `${API_URL}bread` }
  } else if (obj.page) {
    request = { method: "GET", url: `${API_URL}bread?page=${obj.page}` }
  } else if (obj.queryBrowse) {
    request = { method: "GET", url: `${API_URL}bread?${obj.queryBrowse}` }
  } else {
    request = { method: "GET", url: `${API_URL}bread?${queryBrowse}&pageBrowse=${obj.pageBrowse}` }
  }

  $.ajax(request)
    .done(function (data) {
      console.log(`its'here`)
      console.log(data)

      let totalPageFrom
      let listFrom
      let currPageFrom
      let fiturBrowser
      if (data.fiturBrowser) {
        totalPageFrom = "totalPageBrowse"
        listFrom = "listBrowse"
        currPageFrom = "currPageBrowse"
        fiturBrowser = "fiturBrowser"
      } else {
        totalPageFrom = "totalPage"
        listFrom = "list"
        currPageFrom = "currPage"
      }

      let listTypeData = ""
      const display = (totalPage, list, currPage, fitur) => {
        console.log(`in the display function wkwkkw ${queryBrowse}`)
        let nameClass = data[fitur] || ""
        data[list].forEach(e => {
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
        let maxPage = data[totalPage]
        let currentPage = data[currPage]
        let paginationButton = ""

        if (currentPage == 1) {
          paginationButton +=
            `<li class="page-item  disabled">
            <button type="submit"  id="pagination" name="page" value="${Number(currentPage) - 1}"
            class="page-link ${nameClass}">Previous</button>
        </li>`
        } else {
          paginationButton +=
            `<li class="page-item ">
              <button type="submit"  id="pagination" name="page"  value="${Number(currentPage) - 1}"
              class="page-link ${nameClass}">Previous</button>
          </li>`
        }
        for (let page = 1; page <= maxPage; page++) {
          if (currentPage == page) {
            paginationButton += `
            <li class="page-item active pg-${page}"> 
              <button type="submit" id="pagination" name="page" value="${page}" class="page-link ${nameClass} ">${page}</button>
            </li>`
          } else {
            paginationButton +=
              `<li class="page-item pg-${page}"> 
              <button type="submit" id="pagination" name="page" value="${page}" class="page-link ${nameClass}">${page}</button>
            </li>`
          }
        }
        if (currentPage == maxPage) {
          paginationButton += `
          <li class="page-item  disabled ">
              <button type="submit"  id="pagination" name="page" value="${Number(currentPage) + 1}" class="page-link ${nameClass} ">Next</button>
          </li>`
        } else {
          paginationButton += `
          <li class="page-item ">
              <button type="submit"  id="pagination" name="page" value="${Number(currentPage) + 1}" class="page-link ${nameClass} ">Next</button>
          </li>`
        }
        $("ul.pagination").html(paginationButton)
      }
      display(totalPageFrom, listFrom, currPageFrom, fiturBrowser)

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
    if (typeof queryBrowse === "undefined") {
      loadData()
    } else {
      loadData({ queryBrowse })
    }
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
    if (typeof queryBrowse === "undefined") {
      loadData()
    } else {
      loadData({ queryBrowse })
    }
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
    if (typeof queryBrowse === "undefined") {
      loadData()
    } else {
      loadData({ queryBrowse })
    }



  }).fail(function (jqXHR, textStatus) {
    alert("Request failed: " + textStatus);
  });
}
// const display = (data, totalPage, list, currPage, fitur) => {
//   let nameClass = data[fitur] || ""
//   data[list].forEach(e => {
//     listTypeData += `<tr>
//             <th scope="row">${e.bread_id}</th>
//             <td> ${e.string_data}</td>
//             <td>${e.integer_data}</td>
//             <td>${e.float_data}</td>
//             <td>${moment(e.date_data).format('YYYY-MM-DD')}</td>
//             <td>${e.boolean_data}</td>
//             <td>
//             <button type="button" class="btn btn-success btn-edit" data-toggle="modal" data-target="#form-popUp" dataId=${e.bread_id}>edit</button> 
//               <button type ="button" class="btn btn-danger btn-delete" dataId="${e.bread_id}">delete</button>
//             </td> 
//           </tr>`

//   });
//   $("table tbody").html(listTypeData)
//   let maxPage = data[totalPage]
//   let currentPage = data[currPage]
//   let paginationButton = ""

//   if (currentPage == 1) {
//     paginationButton +=
//       `<li class="page-item  disabled">
//       <button type="submit"  id="pagination" name="page" value="${Number(currentPage) - 1}"
//       class="page-link ${nameClass}">Previous</button>
//   </li>`
//   } else {
//     paginationButton +=
//       `<li class="page-item ">
//         <button type="submit"  id="pagination" name="page"  value="${Number(currentPage) - 1}"
//         class="page-link ${nameClass}">Previous</button>
//     </li>`
//   }
//   for (let page = 1; page <= maxPage; page++) {
//     if (currentPage == page) {
//       paginationButton += `
//       <li class="page-item active pg-${page}"> 
//         <button type="submit" id="pagination" name="page" value="${page}" class="page-link ${nameClass} ">${page}</button>
//       </li>`
//     } else {
//       paginationButton +=
//         `<li class="page-item pg-${page}"> 
//         <button type="submit" id="pagination" name="page" value="${page}" class="page-link ${nameClass}">${page}</button>
//       </li>`
//     }
//   }
//   if (currentPage == maxPage) {
//     paginationButton += `
//     <li class="page-item  disabled ">
//         <button type="submit"  id="pagination" name="page" value="${Number(currentPage) + 1}" class="page-link ${nameClass} ">Next</button>
//     </li>`
//   } else {
//     paginationButton += `
//     <li class="page-item ">
//         <button type="submit"  id="pagination" name="page" value="${Number(currentPage) + 1}" class="page-link ${nameClass} ">Next</button>
//     </li>`
//   }
//   $("ul.pagination").html(paginationButton)
// }