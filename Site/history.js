class ObjHistory {
  records = [];
  maxLength = 0;

  constructor(maxLength = 10) {
    this.maxLength = maxLength;
  }

  addRecord(record) {
    if (this.records.length >= this.maxLength) this.removeOldest();
    this.records.push(record);
  }

  removeOldest(amount = 1) {
    this.records.splice(0, amount);
  }

  popLatest() {
    return this.records.pop()
  }
}