import "./style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "material-icons/iconfont/material-icons.css";
const commentsContainer = document.querySelector("#comments");
const commentInput = document.querySelector("#commentInput");
const sendComment = document.querySelector("#sendComment");
let comments = [];
const currentUserImage = "./public/image-juliusomo-GOpOiOke.webp";
function saveComments() {
  localStorage.setItem("comments", JSON.stringify(comments));
}
function loadComments() {
  const data = JSON.parse(localStorage.getItem("comments"));

  if (data) {
    comments = data;
  }

  renderComments();
}
const defaultComments = [
  {
    id: 1,
    user: {
      username: "amyrobson",
      image: "/public/image-amyrobson-DIYtJakD.webp",
    },
    content:
      "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
    score: 9,
    createdAt: "2 years ago",
  },
  {
    id: 2,
    user: {
      username: "maxblagun",
      image: "/public/image-maxblagun-BOzb0Wbd.webp",
    },
    content:
      "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
    score: 7,
    createdAt: "2 years ago",
    replies: [
      {
        id: 201,
        user: {
          username: "ramsesmiron",
          image: "/public/image-ramsesmiron-C5YlnrVr.webp",
        },
        content:
          "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
        score: 4,
        createdAt: "1 week ago",
        replyingTo: "maxblagun",
        isOwner: false,
      },

      {
        id: 202,
        user: {
          username: "juliusomo",
          image: "./public/image-juliusomo-GOpOiOke.webp",
        },
        content:
          "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
        score: 2,
        createdAt: "1 week ago",
        replyingTo: "ramsesmiron",
        isOwner: true,
      },
    ],
  },
];
const savedComments = JSON.parse(localStorage.getItem("comments"));
comments = savedComments || defaultComments;
function createComment(comment) {
  const card = document.createElement("div");
  card.className = "bg-white rounded-xl p-6 flex gap-5 shadow-sm";

  const scoreBox = document.createElement("div");
  scoreBox.className =
    "bg-slate-100 rounded-xl px-3 py-2 flex flex-col items-center gap-3 h-fit";

  const plusBtn = document.createElement("button");
  plusBtn.innerHTML = `<i class="fa-solid fa-plus"></i>`;
plusBtn.className = "score-btn text-indigo-300";
  plusBtn.dataset.id = comment.id;
  plusBtn.dataset.type = "plus";

  const score = document.createElement("span");
  score.textContent = comment.score;
  score.className = "font-bold text-moderate-blue";

  const minusBtn = document.createElement("button");
  minusBtn.innerHTML = `<i class="fa-solid fa-minus"></i>`;
minusBtn.className = "score-btn text-indigo-300";
  minusBtn.dataset.id = comment.id;
  minusBtn.dataset.type = "minus";

  scoreBox.append(plusBtn, score, minusBtn);

  const right = document.createElement("div");
  right.className = "flex-1";

  const header = document.createElement("div");
  header.className = "flex justify-between items-center";

  const userInfo = document.createElement("div");
  userInfo.className = "flex items-center gap-4";

  const avatar = document.createElement("img");
  avatar.src = comment.user.image;
  avatar.className = "w-10 h-10";

  const username = document.createElement("span");
  username.textContent = comment.user.username;
  username.className = "font-bold";

  const createdAt = document.createElement("span");
  createdAt.textContent = comment.createdAt;
  createdAt.className = "text-gray-400";

  userInfo.append(avatar, username, createdAt);

  const actions = document.createElement("div");
  actions.className = "flex items-center gap-5";

 const replyBtn = document.createElement("button");

 replyBtn.className =
   "reply-btn text-indigo-500 font-bold flex items-center gap-2";

 replyBtn.innerHTML = `
  <i class="fa-solid fa-reply hover:text-violet-400"></i>
  Reply
`;

 replyBtn.dataset.id = comment.id;

 if (comment.isOwner) {
   actions.innerHTML = `
    <button 
      class="delete-btn text-red-500 font-bold"
      data-id="${comment.id}">
      <i class="fa-solid fa-trash"></i>
      Delete
    </button>

    <button 
      class="edit-btn text-indigo-500 font-bold"
      data-id="${comment.id}">
      <i class="fa-solid fa-pen"></i>
      Edit
    </button>
  `;
 } else {
   actions.append(replyBtn);
 }

  header.append(userInfo, actions);

  const content = document.createElement("p");
  content.textContent = comment.content;
  content.className = "text-gray-500 leading-7 mt-4";

  right.append(header, content);

  card.append(scoreBox, right);

  if (comment.replies && comment.replies.length > 0) {
    const repliesContainer = document.createElement("div");

    repliesContainer.className = "ml-12 mt-5 space-y-5";

    comment.replies.forEach((reply) => {
      repliesContainer.append(createReply(reply));
    });

    const wrapper = document.createElement("div");
    wrapper.append(card, repliesContainer);

    return wrapper;
  }

  return card;
}
function renderComments() {
  commentsContainer.innerHTML = "";

  const sortedComments = [...comments].sort((a, b) => {
    return b.score - a.score;
  });

  sortedComments.forEach((comment) => {
    commentsContainer.append(createComment(comment));
  });
}
commentsContainer.addEventListener("click", (e) => {
  const replyButton = e.target.closest(".reply-btn");

  if (replyButton) {
    const id = Number(replyButton.dataset.id);

    const oldBox = document.querySelector(".reply-box");

    if (oldBox) {
      oldBox.remove();
    }

    const box = createReplyBox(id);

    box.classList.add("reply-box");

    replyButton.closest(".bg-white").after(box);

    return;
  }

  const sendReplyBtn = e.target.closest(".send-reply");

  if (sendReplyBtn) {
    const input = document.querySelector(".reply-input");

    if (!input.value.trim()) return;

    const parent = findCommentById(Number(sendReplyBtn.dataset.id), comments);

    const newReply = {
      id: Date.now(),
      user: {
        username: "juliusomo",
        image: currentUserImage,
      },
      content: input.value,
      score: 0,
      createdAt: "Just now",
      replyingTo: parent.user.username,
      isOwner: true,
    };

    if (!parent.replies) {
      parent.replies = [];
    }

    parent.replies.push(newReply);

    saveComments();

    renderComments();

    return;
  }
  const deleteBtn = e.target.closest(".delete-btn");

  if (deleteBtn) {
    const id = Number(deleteBtn.dataset.id);

    comments = comments.filter((comment) => comment.id !== id);

    comments.forEach((comment) => {
      if (comment.replies) {
        comment.replies = comment.replies.filter((reply) => reply.id !== id);
      }
    });

    saveComments();
    renderComments();

    return;
  }

  const editBtn = e.target.closest(".edit-btn");

  if (editBtn) {
    const id = Number(editBtn.dataset.id);

    const reply = findCommentById(id, comments);

    const card = editBtn.closest(".bg-white");

const textElement = card.querySelector("p");
    textElement.innerHTML = `
    <input 
      class="edit-input border rounded-lg px-4 py-3 w-full"
      value="${reply.content}"
    >

    <button 
      class="save-edit bg-indigo-500 text-white px-4 py-2 rounded-lg mt-3"
      data-id="${reply.id}">
      Save
    </button>
  `;

    return;
  }
const saveEdit = e.target.closest(".save-edit");

if (saveEdit) {
  const id = Number(saveEdit.dataset.id);

  const reply = findCommentById(id, comments);

  const input = document.querySelector(".edit-input");

  reply.content = input.value.trim();

  saveComments();

  renderComments();

  return;
}

  const btn = e.target.closest(".score-btn");

  if (!btn) return;

  const id = Number(btn.dataset.id);
  const type = btn.dataset.type;

  const comment = findCommentById(id, comments);

  if (!comment) return;

  if (type === "plus") comment.score++;

  if (type === "minus" && comment.score > 0) comment.score--;

  saveComments();
  renderComments();
});


  
function findCommentById(id, list) {
  for (const comment of list) {
    if (comment.id === id) return comment;

    if (comment.replies) {
      const reply = comment.replies.find((r) => r.id === id);

      if (reply) return reply;
    }
  }

  return null;
}

sendComment.addEventListener("click", () => {
  const text = commentInput.value.trim();

  if (!text) return;

 const newComment = {
   id: Date.now(),
   content: text,
   score: 0,
   createdAt: "Just now",
   user: {
     username: "juliusomo",
     image: "./public/image-juliusomo-GOpOiOke.webp",
   },
   isOwner: true,
 };

  comments.push(newComment);

  saveComments();

  renderComments();

  commentInput.value = "";
});
function createReply(reply) {
  const replyCard = document.createElement("div");

  replyCard.className = "bg-white rounded-xl p-6 flex gap-5 shadow-sm";

  replyCard.innerHTML = `
    <div class="bg-slate-100 rounded-xl px-3 py-2 flex flex-col items-center gap-3 h-fit">

  <button 
    class="score-btn text-indigo-300" 
    data-id="${reply.id}" 
    data-type="plus">
    <i class="fa-solid fa-plus"></i>
  </button>

  <span class="font-bold text-moderate-blue">
    ${reply.score}
  </span>

  <button 
    class="score-btn text-indigo-300" 
    data-id="${reply.id}" 
    data-type="minus">
    <i class="fa-solid fa-minus"></i>
  </button>

</div>
    <div class="flex-1">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <img src="${reply.user.image}" class="w-10 h-10">

          <span class="font-bold">
            ${reply.user.username}
          </span>

          <span class="text-gray-400">
            ${reply.createdAt}
          </span>
        </div>

        ${
          reply.isOwner
            ? `
      <div class="flex gap-5">
        <button 
 class="delete-btn text-red-500 font-bold"
 data-id="${reply.id}">
          <i class="fa-solid fa-trash"></i>
          Delete
        </button>

        <button 
 class="edit-btn text-indigo-500 font-bold"
 data-id="${reply.id}">
          <i class="fa-solid fa-pen"></i>
          Edit
        </button>
      </div>
    `
            : `
      <button class="text-indigo-500 font-bold reply-btn" data-id="${reply.id}">
        <i class="fa-solid fa-reply hover:text-violet-400"></i>
        Reply
      </button>
    `
        }
      </div>

      <p class="text-gray-500 leading-7 mt-4">
        <span class="text-indigo-500 font-bold">
          @${reply.replyingTo}
        </span>
        ${reply.content}
      </p>
    </div>
  `;

  return replyCard;
}
function createReplyBox(id) {
  const box = document.createElement("div");

  box.className = "bg-white rounded-xl p-6 flex items-center gap-5 mt-5 ml-12";

  box.innerHTML = `
    <img 
      src="${currentUserImage}" 
      class="w-10 h-10"
    >

    <input
      class="reply-input flex-1 border rounded-lg px-4 py-3"
      placeholder="Write a reply..."
    >

    <button 
      class="send-reply bg-indigo-500 text-white px-5 py-3 rounded-lg"
      data-id="${id}">
      SEND
    </button>
  `;

  return box;
}

loadComments();