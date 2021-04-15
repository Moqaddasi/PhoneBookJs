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
  return this;
}

function PhoneBook() {
  this.records = [];
  this.searchedRecords = [];
  this.add = function (record = { name: "", phone: "" }) {
    const isDuplicatedRecord = (rec, recs) =>
      recs.find((r) => r.name == rec.name && r.phone == rec.phone);
    const isNotValidRecord = (rec, recs) =>
      rec.name === "" || rec.phone === "" || isDuplicatedRecord(rec, recs);
    if (isNotValidRecord(record, this.records)) return;
    this.records.unshift(new PhoneBookRecord(record.name, record.phone));
  };
  this.search = function (name) {
    this.searchedRecords = this.records.filter((record) =>
      record.name.toLowerCase().includes(name.toLowerCase())
    );
  };
  this.remove = function (record) {
    this.records = this.records.filter(
      (rec) => rec.name !== record.name || rec.phone !== record.phone
    );
  };
}

function Render(container) {
  this.container = container;
  const phoneBook = new PhoneBook();
  const onRemoveHandler = (listElem, record) => {
    phoneBook.remove(record);
    renderList(listElem, phoneBook.records);
  };
  const addRecordToList = (listElem, record) => {
    const listItem = generateHtmlRecord(record, () =>
      onRemoveHandler(listElem, record)
    );
    listItem.appendTo(listElem);
  };
  const renderList = function (listElem, records) {
    listElem.innerHTML = "";
    records.forEach((record) => addRecordToList(listElem, record));
  };
  const generateHtmlRecord = (record, removeHandler) => {
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
      .onClick(removeHandler);
    builder
      .create("i")
      .setClasses("fa fa-close")
      .appendTo(deleteButton.element);
    return htmlRecord;
  };
  this.init = function () {
    const contactList = builder.create("div").setId("list");
    builder
      .create("h1")
      .setClasses("text")
      .setText("PhoneBook App")
      .appendTo(container);
    const searchContactInput = builder
      .create("input")
      .setId("search")
      .setName("search")
      .setPlaceholder("search")
      .setClasses("input")
      .setValue("")
      .onInput(() => {
        phoneBook.search(searchContactInput.element.value);
        renderList(contactList.element, phoneBook.searchedRecords);
      })
      .appendTo(container);
    builder
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
    builder
      .create("button")
      .setId("add")
      .setText("Add")
      .setClasses("submit")
      .onClick(() => {
        const newRecord = new PhoneBookRecord(
          nameInput.element.value,
          phoneInput.element.value,
          this.records
        );
        phoneBook.add(newRecord);
        renderList(contactList.element, phoneBook.records);
      })
      .appendTo(container);
    builder.create("hr").appendTo(container);
    contactList.appendTo(container);
  };
}

const phoneBookContainer = document.getElementById("phone-book-container");
const app = new Render(phoneBookContainer);
app.init();
