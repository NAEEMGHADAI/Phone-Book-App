const deleteEntry = document.querySelectorAll(".trash");
const editEntry = document.querySelectorAll(".edit");
const formUpdate = document.querySelector(".form-update");

const updateNumber = document.querySelector(".update-number");
const updateSubmit = document.querySelector(".update-submit");

Array.from(editEntry).forEach((element) => {
	element.addEventListener("click", EditFun);
});

Array.from(deleteEntry).forEach((element) => {
	element.addEventListener("click", deleteFun);
});

async function deleteFun() {
	console.log(this.parentNode.childNodes[1].innerText);
	const name = this.parentNode.childNodes[3].innerText;
	const number = this.parentNode.childNodes[5].innerText;
	console.log(name, number);
	try {
		const response = await fetch(`/api/delete`, {
			method: "delete",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: name,
				number: number,
			}),
		});
		const data = await response.json();
		console.log(data);
		location.reload();
	} catch (err) {
		console.log(err);
	}
}

let nameUpdate = "";
async function EditFun() {
	formUpdate.style.display = "block";
	nameUpdate = this.parentNode.childNodes[3].innerText;
	console.log(nameUpdate);
}

updateSubmit.addEventListener("click", async () => {
	let number = updateNumber.value;
	if (number.length) {
		console.log(number);
		const response = await fetch(`/api/presons-update`, {
			method: "put",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: nameUpdate,
				number: number,
			}),
		});
		const data = await response.json();
		console.log(data);
	}
});
