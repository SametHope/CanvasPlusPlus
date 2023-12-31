const docStyle = document.documentElement.style;

class Property {
  static instances = [];
  #identifier;
  #value;

  constructor(identifier, defaultValue) {
    this.#identifier = identifier;
    this.#value = defaultValue;

    Property.instances.push(this);
    docStyle.setProperty(this.#identifier, this.#value);
  }

  get identifier() {
    return this.#identifier;
  }

  get value() {
    return this.#value;
  }

  set value(newValue) {
    this.#value = newValue;
    docStyle.setProperty(this.#identifier, this.#value);
  }
}