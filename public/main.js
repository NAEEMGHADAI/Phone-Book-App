const deleteEntry = document.querySelectorAll(".trash");
const editEntry = document.querySelectorAll(".edit");
const formUpdate = document.querySelector(".form-update");
const updateName = document.querySelector(".update-name");
const updateSubmit = document.querySelector(".update-submit");
const addButton = document.querySelector(".add-button");
const form = document.querySelector(".form");
const modal = document.getElementById("myModal");
const modal2 = document.getElementById("myModal2");
const span = document.querySelectorAll(".close");

Array.from(editEntry).forEach((element) => {
	element.addEventListener("click", EditFun);
});

Array.from(deleteEntry).forEach((element) => {
	element.addEventListener("click", deleteFun);
});

async function deleteFun() {
	try {
		console.log(this.parentNode.childNodes[1].innerText);
		const name = this.parentNode.childNodes[1].innerText;
		const number = this.parentNode.childNodes[3].innerText;
		// console.log(name, number);

		let body = { name, number };
		const response = await fetch(`/api/delete`, {
			method: "delete",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});

		const data = await response.json();
		console.log(data);
		location.reload();
	} catch (err) {
		console.log(err);
	}
}

let numberUpdate = "";
async function EditFun() {
	modal2.style.display = "block";
	numberUpdate = this.parentNode.childNodes[3].innerText;
	console.log(numberUpdate);
}

updateSubmit.addEventListener("click", async () => {
	let name = updateName.value;
	if (name.length) {
		console.log(name);
		const response = await fetch(`/api/presons-update`, {
			method: "put",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: name,
				number: numberUpdate,
			}),
		});
		const data = await response.json();
		console.log(data);
		location.reload();
	}
});

addButton.addEventListener("click", () => {
	modal.style.display = "block";
});

// When the user clicks on <span> (x), close the modal

span.forEach((element) => {
	element.addEventListener("click", () => {
		modal.style.display = "none";
		modal2.style.display = "none";
	});
});
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
	if (event.target == modal2) {
		modal2.style.display = "none";
	}
};
