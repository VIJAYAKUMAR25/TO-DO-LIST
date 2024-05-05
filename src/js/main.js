// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";
import $, { ajax } from "jquery";
// ---------------------------------Calendar start------------------------------///
const date = new Date();

const renderCalendar = () => {
  date.setDate(1);

  const monthDays = document.querySelector(".days");

  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  const firstDayIndex = date.getDay();

  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();

  const nextDays = 7 - lastDayIndex - 1;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  document.querySelector(".date h1").innerHTML = months[date.getMonth()];

  document.querySelector(".date p").innerHTML = new Date().toDateString();

  let days = "";

  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDay; i++) {
    if (
      i === new Date().getDate() &&
      date.getMonth() === new Date().getMonth()
    ) {
      days += `<div class="today">${i}</div>`;
    } else {
      days += `<div>${i}</div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="next-date">${j}</div>`;
  }
  monthDays.innerHTML = days;
};

document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});

renderCalendar();

// -----------------------------------------calendarEND-=--------------



// -------  ------------------------------
$(function(){
  function LoadComponent(page){
    $.ajax({
        method:'get',
        url: page,
        success: (response)=>{
            $("main").html(response);
        }
     })
}



function LoadAppointments(UserId) {
  $("#appointmentscontainer").html("");
  $.ajax({
      method:'get',
      url: `http://localhost:5050/appointments/${UserId}`,
      success: (appointments)=> {
          $("#UserIdContainer").append(`<span>${sessionStorage.getItem("UserId")}</span>`);
          appointments.map(item=>{
              var dueDate = new Date(item.DueDate);
              var formattedDueDate = dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
              var priority = item.TaskPriority;
              $(`
                  <div class="card p-4 m-3 rounded-3" style="min-width: 23rem;">
                      <div class="card-head bg-primary text-white rounded-3 p-2 text-center">
                          <span class="card-title fs-1">${item.Title}</span>
                      </div>
                      <div class="card-body bg-light">
                          <div class="card-text fs-3">${item.Description}</div>
                          <div class="text-primary fs-4">${formattedDueDate}</div> <!-- Display formatted due date -->
                          <div class="Priority-background text-secondary fs-2 fw-bold">${item.TaskPriority}</div>
                      </div>
                      <div class="card-footer d-flex justify-content-between">
                          <button value=${item.Id} id="btnEdit" class="btn btn-warning bi bi-pencil-square"></button>
                          <button value=${item.Id} id="btnDelete" class="btn btn-danger"> Delete</button>
                      </div>
                  </div>
              `).appendTo("#appointmentscontainer");
          })
      }
  })
}




$("#btnHomeRegister").click(()=>{
  LoadComponent('register.html');
})
$("#btnHomeLogin").click(()=>{
  LoadComponent('login.html');
})
$(document).on("click", "#btnNavLogin", ()=>{
  LoadComponent('login.html');
})
$(document).on("click", "#btnNavRegister", ()=>{
  LoadComponent('register.html');
})
$(document).on("click", "#btnBackNav", ()=>{
  window.location.reload();
})
$(document).on("click","#btnAddAppointments",()=>{
LoadComponent('add-appointment.html');
})
$(document).on('click','#btnSignOut',()=>{
  LoadComponent('login.html');
  sessionStorage.removeItem("UserId");
})
$(document).on('click','#btnEdit',()=>{
  LoadComponent('edit-appointment.html');
})



 // ---------------------ON Register Click--------------------

 $(document).on("click", "#RbtnRegister",()=>{
  $(".text-danger").text("");


  var userId = $("#RuserId").val();
  var email = $("#Remail").val();
  var password = $("#Rpassword").val();
  var confirmPassword = $("#Rcpassword").val();
  var dob = $("#Rdob").val();
  var gender = $("input[name='gender']:checked").val();


  var isValid = true;

  if (!userId) {
      $("#RUsererror").text("User ID is required.");
      isValid = false;
  }else if(userId.length<6){
    $("#RUsererror").text("User id must be more than 6 charecter");
      isValid = false;
  }
  if (!email) {
      $("#REmailerror").text("Email is required.");
      isValid = false;
  } else if (!isValidEmail(email)) {
      $("#REmailerror").text("Invalid email address.");
      isValid = false;
  }
  if (!password) {
    $("#RPassworderror").text("Password is required.");
    isValid = false;
  } else if (!/(?=.*[A-Z])/.test(password)) {
    $("#RPassworderror").text("Password must contain at least one uppercase letter.");
    isValid = false;
  } else if (password.length < 8) {
    $("#RPassworderror").text("Password must be at least 8 characters long.");
    isValid = false;
  }
  if (password !== confirmPassword) {
      $("#RCpassworderror").text("Passwords do not match.");
      isValid = false;
  }
  if (!dob) {
      $("#RDOBerror").text("Date of Birth is required.");
      isValid = false;
  }
  if (!gender) {
      $("#RGendererror").text("Please select Gender .");
      isValid = false;
  }
  if (isValid) {
        
  var user = {
    UserId: $("#RuserId").val(),
    Email: $("#Remail").val(),
    Gender: $('input[name="gender"]:checked').val(),
    Password: $("#Rpassword").val(),
    DOB: $("#Rdob").val()
};
$.ajax({
    method: 'post',
    url: 'http://127.0.0.1:5050/register-user',
    data: user
})
alert('Registered Successfully..');
LoadComponent('login.html');
  }
})

$(document).on("change","#RuserId",()=>{
  $.ajax({
    method:"get",
    url:'http://127.0.0.1:5050/register-user',
    success:(users)=>{
      var user = users.find(item=>item.UserId==$('#RuserId').val());
      if(user){
        $('#Rusererror').html('Userid taken please try another');
      }else{
        $('#Rusererror').html('Userid available');
      }
    }
  })
})

function isValidEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
// --------------------Login Click------

$(document).on("click", "#btnLogin",()=>{
       
$.ajax({
   method: 'get',
   url: 'http://localhost:5050/users',
   success:(users)=> {
       var user = users.find(item=> item.UserId===$("#LUserId").val());
       if(user && user.Password===$("#Lpassword").val())
       {
           sessionStorage.setItem("UserId", user.UserId);
           LoadComponent('appointments.html');
           LoadAppointments($("#LUserId").val());
       } else {
           $("#lblError").html('Invalid Login: Please check your email and password');
       }
   }
})
})

//  ----------------------ON ADD APPOINTMENT

$(document).on('click','#btnAddNewTask',()=>{
  $(".text-danger").text("");


  var title = $('#Atitle').val();
  var createdId =parseInt( Math.floor(1000 + Math.random() * 9000));
  var id = $('#Aid').val(createdId);
  var priority = $('#Apriority').val();
  var dueDate = $('#Adate').val();
  var description = $('#Adescription').val();
  var userId = sessionStorage.getItem("UserId");


  var isValid = true;

  if (!title) {
      $("#Atitleerror").text("Task Title is required.");
      isValid = false;
  }

  if (!id) {
      $("#Aiderror").text("Task Id is required.");
      isValid = false;
  }

  if (priority === "-1") {
      $("#Apriorityerror").text("Please select Task Priority.");
      isValid = false;
  }

  if (!dueDate) {
      $("#Adateerror").text("Due Date is required.");
      isValid = false;
  }

  if (!description) {
      $("#Adescriptionerror").text("Task Description is required.");
      isValid = false;
  }

  if(isValid){
          var appointment = {
              Title: $('#Atitle').val(),
              Id:$('#Aid').val(),
              TaskPriority:$('#Apriority').val(),
              DueDate:$('#Adate').val(),
              Description:$('#Adescription').val(),
              UserId:sessionStorage.getItem("UserId")
              }
              $.ajax({
                method:"post",
                url:'http://127.0.0.1:5050/add-task',
                data:appointment
              })
              alert('Appointment Added Succesfully..');
              LoadComponent('appointments.html');
              LoadAppointments(appointment.UserId)
                }
})
// ------------------------ADD Appointment END

// ------------------------Delete Appointment
$(document).on("click", "#btnDelete",(e)=>{
  var flag = confirm('Are your sure\nWant to Delete?');
  if(flag==true){
    $.ajax({
        method: 'delete',
        url: `http://127.0.0.1:5050/delete-task/${e.target.value}`
     })
     alert('Deleted Successfully..');
    LoadAppointments(sessionStorage.getItem("UserId"));
  }
})

////-------------edit Appointment----------------

$(document).on("click","#btnEdit",(e)=>{
  LoadComponent("edit-appointment.html");
  $.ajax({
      method:'get',
      url: `http://127.0.0.1:5050/get-byid/${e.target.value}`,
      success: (appointments)=>{
          $("#Etitle").val(appointments[0].Title);
          $("#Eid").val(appointments[0].Id);
          $("#Epriority").val(appointments[0].TaskPriority);
          var formattedDate = new Date(appointments[0].DueDate).toISOString().split('T')[0];
          $("#Edate").val(formattedDate);
          $("#Edescription").val(appointments[0].Description);
      }
  })
})

// -----Save Edited appointment----------
$(document).on("click","#btnSave",()=>{
  $(".text-danger").text("");

   
    var title = $('#Etitle').val();
    var id = $('#Eid').val();
    var priority = $('#Epriority').val();
    var dueDate = $('#Edate').val();
    var description = $('#Edescription').val();
    var userId = sessionStorage.getItem("UserId");

    var isValid = true;
    if (!title) {
        $("#Etittleerror").text("Task Title is required.");
        isValid = false;
    }

    if (!id) {
        $("#Eiderror").text("Task Id is required.");
        isValid = false;
    }

    if (priority === "-1") {
        $("#Epriorityerror").text("Please select Task Priority.");
        isValid = false;
    }

    if (!dueDate) {
        $("#Edateerror").text("Due Date is required.");
        isValid = false;
    }

    if (!description) {
        $("#Edescriptionerror").text("Task Description is required.");
        isValid = false;
    }




  if(isValid){

    var editedappointment = {
      Title: $('#Etitle').val(),
      Id:$('#Eid').val(),
      TaskPriority:$('#Epriority').val(),
      DueDate:$('#Edate').val(),
      Description:$('#Edescription').val(),
      UserId:sessionStorage.getItem("UserId")
    }
    $.ajax({
       method:'put',
       url:`http://127.0.0.1:5050/edit-task/${editedappointment.Id}`,
       data: editedappointment
       
    })
    alert("Appointment Edited successfully...")
    LoadComponent('appointments.html');
    LoadAppointments(sessionStorage.getItem("UserId"));
  }
})



})



// -----------password eye slash
$(document).ready(function() {
 
});

// JavaScript (with jQuery)


