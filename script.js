function ElementBuilder(tagName) {
  this.element = document.createElement(tagName);

  this.setText = function (text) {
    this.element.textContent = text;
    return this;
  };
  this.setId = function (id) {
    this.element.id = id;
    return this;
  };
  this.setClasses = function (classes) {
    this.element.className = classes;
    return this;
  };
  this.setValue = function (value) {
    this.element.value = value;
    return this;
  };
  this.setAttribute = function (value) {
    this.element.Attribute = value;
    return this;
  };

  this.setPlaceholder = function (placeholder) {
    this.element.placeholder = placeholder;
    return this;
  };
  this.setName = function (name) {
    this.element.name = name;
    return this;
  };
  this.onClick = function (callback) {
    this.element.addEventListener("click", callback);
    return this;
  };
  this.onInput = function (callback) {
    this.element.addEventListener("input", callback);
    return this;
  };
  this.appendTo = function (parentNode) {
    parentNode.append(this.element);
    return this;
  };
  this.prependTo = function (parentNode) {
    parentNode.prepend(this.element);
    return this;
  };

  //others add here

  this.build = function () {
    return this.element;
  };
}

const builder = {
  create: function (name) {
    return new ElementBuilder(name);
  },
};

function PhoneBookRecord(name, phone) {
  this.name = name;
  this.phone = phone;
}
const generateHtmlRecord = (record, onRemoveHandler) => {
  const htmlRecord = builder.create("div").setClasses("div-box");
  const htmlRecordElement = htmlRecord.element;
  builder
    .create("div")
    .setText(record.name)
    .setClasses("contact-info")
    .appendTo(htmlRecordElement);

  builder
    .create("div")
    .setText(record.phone)
    .setClasses("contact-info")
    .appendTo(htmlRecordElement);

  const deleteButton = builder
    .create("span")
    .setClasses("delete-icon")
    .appendTo(htmlRecordElement)
    .onClick(onRemoveHandler);
  builder.create("i").setClasses("fa fa-close").appendTo(deleteButton.element);
  return htmlRecord;
};
const isNotValidRecord = (record, records) =>
  record.name === "" ||
  record.phone === "" ||
  isDuplicatedRecord(record, records);

const isDuplicatedRecord = (record, records) =>
  records.find((r) => r.name == record.name && r.phone == record.phone);
function PhoneBook() {
  this.records = [];
  this.addRecordToListHtml = (listContainerElement, record) => {
    const listItem = generateHtmlRecord(record, () => {
      this.removeFromRecord(record);
      this.refreshList(listContainerElement);
    });
    listItem.appendTo(listContainerElement);
  };
  this.add = function (listContainerElement, record = { name: "", phone: "" }) {
    if (isNotValidRecord(record, this.records)) return;
    this.records.push(record);
    this.addRecordToListHtml(listContainerElement, record);
    return this;
  };
  this.refreshList = function (listContainerElement, records = this.records) {
    listContainerElement.innerHTML = "";
    records.forEach((record) => {
      this.addRecordToListHtml(listContainerElement, record);
    });

    return this;
  };
  this.search = function (listContainerElement, name) {
    const list = this.records.filter((record) =>
      record.name.toLowerCase().includes(name.toLowerCase())
    );
    this.refreshList(listContainerElement, list);

    return this;
  };
  this.removeFromRecord = function (record) {
    this.records = this.records.filter(
      (rec) => rec.name !== record.name || rec.phone !== record.phone
    );
    return this;
  };

  //add search remove functions add here
}

function Render(container) {
  this.container = container;
  const phoneBook = new PhoneBook();

  this.init = function () {
    const contactList = builder.create("div").setId("list");

    const header = builder
      .create("h1")
      .setClasses("text")
      .setText("Phonebook App")
      .appendTo(container);
    const searchContactInput = builder
      .create("input")
      .setId("search")
      .setName("search")
      .setPlaceholder("search")
      .setClasses("input")
      .setValue("")
      .onInput(() => {
        phoneBook.search(contactList.element, searchContactInput.element.value);
      })
      .appendTo(container);

    const addNewContactHeader = builder
      .create("h2")
      .setClasses("text")
      .setText("Add New Contact")
      .appendTo(container);

    const nameInput = builder
      .create("input")
      .setId("name")
      .setName("name")
      .setPlaceholder("name")
      .setClasses("input")
      .setValue("")
      .appendTo(container);
    const phoneInput = builder
      .create("input")
      .setId("phone")
      .setName("phone")
      .setPlaceholder("phone")
      .setClasses("input")
      .setValue("")
      .appendTo(container);
    const addButton = builder
      .create("button")
      .setId("add")
      .setText("Add")
      .setClasses("submit")
      .onClick(() => {
        phoneBook.add(contactList.element, {
          name: nameInput.element.value,
          phone: phoneInput.element.value,
        });
      })
      .appendTo(container);

    const hr = builder.create("hr").appendTo(container);
    contactList.appendTo(container);
  };

  //other functions
}

const phoneBookContainer = document.getElementById("phone-book-container");
const app = new Render(phoneBookContainer);
app.init();
