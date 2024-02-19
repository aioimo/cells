class Colors {
  getColor(val) {
    return val;
  }
  constructor($colors) {
    this.$colors = $colors;
  }

  displayColorTable(logic) {
    const ordering = logic.ordering;
    this.$colors.innerHTML = '';

    ordering.forEach((name) => {
      const color = this.getColor(name);
      this.createRow(color);
    });
  }

  updateColorStatistics(logic) {
    const results = logic.countAll();
    Object.keys(results)
      .sort()
      .forEach((name) => {
        const color = this.getColor(name);
        const $count = document.getElementById(this.colorCountId(color));
        $count.innerText = results[name] || 0;
      });
  }

  createRow(color) {
    const $col1 = document.createElement('td');
    const $square = document.createElement('div');
    $square.classList.add('small-square');
    $square.style.color = color;
    $square.style.backgroundColor = color;
    $col1.appendChild($square);

    const $col2 = document.createElement('td');
    $col2.id = this.colorCountId(color);

    const $row = document.createElement('tr');
    $row.appendChild($col1);
    $row.appendChild($col2);

    this.$colors.appendChild($row);
  }

  colorCountId(color) {
    return `${color}-value`;
  }
}
