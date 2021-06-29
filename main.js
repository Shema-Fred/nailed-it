window.onload = function () {
  getUsers();
};

async function getUsers() {
  let spinner = document.querySelector(".users-container .spinner");
  let usersMessage = document.querySelector(".users-message");
  let usersContainer = document.querySelector(".users-container");
  let postsContainer = document.querySelector(".posts-container");

  postsContainer.classList.add("hide");
  clearPage();
  usersContainer.classList.remove("hide");

  try {
    spinner.classList.remove("hide");
    usersMessage.textContent = "";
    let response = await makeCall(`https://jsonplaceholder.typicode.com/users`);
    makeUsers(response);
  } catch (error) {
    console.log(error);
    usersMessage.textContent = "No posts available at the moment!";
  } finally {
    spinner.classList.add("hide");
  }
}

async function makeUsers(users) {
  let usersContainer = document.querySelector(".users");

  users.forEach((user) => {
    let userMarkup = document.createElement("div");
    userMarkup.classList.add("user");
    userMarkup.innerHTML = `
      <div class="col details">
          <div class="name">${user.name}</div>
          <div class="email">${user.email}</div>
      </div>
      <div class="col">
          <button class="btn" id="${user.id}">Posts</button>
      </div>`;
    usersContainer.appendChild(userMarkup);
  });
  let getPostsBtns = document.querySelectorAll(".users button");
  getPostsBtns.forEach((btn) => {
    btn.onclick = getPosts;
  });
}

async function getPosts(e) {
  let id = e.target.id;
  let usersContainer = document.querySelector(".users-container");

  let postsContainer = document.querySelector(".posts-container");
  let postsMessage = document.querySelector(".posts-message");
  let spinner = document.querySelector(".posts-container .spinner");

  usersContainer.classList.add("hide");
  clearPage();
  postsContainer.classList.remove("hide");

  try {
    spinner.classList.remove("hide");
    postsMessage.textContent = "";
    let response = await makeCall(
      `https://jsonplaceholder.typicode.com/posts?userId=${id}`
    );
    makePosts(response);
  } catch (error) {
    console.log(error);
    postsMessage.textContent = "No posts available at the moment!";
  } finally {
    spinner.classList.add("hide");
  }
}

async function makePosts(posts) {
  let postsSidebar = document.querySelector(".posts .sidebar ul");
  let backContainer = document.querySelector(".back-to-users");
  let backBtn = document.createElement("button");
  backBtn.classList.add("btn");
  backBtn.innerText = "Back to users";
  backBtn.onclick = getUsers;
  backContainer.appendChild(backBtn);
  setPost(posts[0]);
  posts.forEach((post) => {
    let postMarkup = document.createElement("li");
    postMarkup.title = post.title;
    postMarkup.innerText = post.title;
    postMarkup.onclick = function () {
      setPost(post);
    };
    postsSidebar.appendChild(postMarkup);
  });
}

function setPost(post) {
  let postsContainer = document.querySelector(".posts .content");
  postsContainer.style = "background: #f5f5f5;";
  let postTitle = document.createElement("div");
  postTitle.classList.add("title");
  postTitle.innerText = post.title;
  let postBody = document.createElement("div");
  postBody.classList.add("body");
  postBody.innerText = post.body;
  clearChilds(postsContainer);
  postsContainer.append(postTitle, postBody);
}

async function makeCall(url) {
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();
    return Promise.resolve(data);
  } else {
    return Promise.reject(response.error());
  }
}
function clearPage() {
  let allUsers = document.querySelectorAll(".user");
  let postsContainer = document.querySelector(".posts");
  let backContainer = document.querySelector(".back-to-users");
  allUsers.forEach((i) => i.remove());
  clearChilds(postsContainer);
  clearChilds(backContainer);
  postsContainer.innerHTML = ` <div class="content"></div><div class="sidebar"><ul></ul></div>`;
}

function clearChilds(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
