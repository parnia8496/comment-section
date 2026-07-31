import "./style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "material-icons/iconfont/material-icons.css";
const plusEl = document.querySelector(".plus");
const minusEl = document.querySelector(".minus");
const scoreEl = document.querySelector(".score");
const replyEl = document.querySelector(".reply");
const replyInput = document.querySelector(".replyInput");
const replyedEl = document.querySelector(".replyed");
const inputValue = document.querySelector(".inputvalue");
const replyCommentBtn = document.querySelector(".replycommentbtn");
let score = Number(localStorage.getItem("score")) || 9;

scoreEl.textContent = score;

plusEl.addEventListener("click", () => {
  score++;
  scoreEl.textContent = score;
  localStorage.setItem("score", score);
});

minusEl.addEventListener("click", () => {
  score--;
  scoreEl.textContent = score;
  localStorage.setItem("score", score);
});

replyEl.addEventListener("click",()=>{
replyInput.classList.remove("hidden")


});
 replyCommentBtn.addEventListener("click",()=>{
replyInput.classList.add("hidden")
replyedEl.classList.remove("hidden")

 })