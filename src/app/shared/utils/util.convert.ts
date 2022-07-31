export class Converter {
  timeConvert(): string {
    const now = new Date();
    let hours = now.getHours().toString();
    let minutes = now.getMinutes().toString();
    let month = (now.getMonth() + 1).toString();
    let date = now.getDate().toString();
    if (Number(hours) < 10) {
      hours = "0" + hours;
    }
    if (Number(minutes) < 10) {
      minutes = "0" + minutes;
    }
    if (Number(month) < 10) {
      month = "0" + month;
    }
    if (Number(date) < 10) {
      date = "0" + date;
    }
    const time = hours + ":" + minutes;
    const fullDate = date + "/" + month + "/" + now.getFullYear();
    return time + " - " + fullDate;
  }

  urlConvert(name): string {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/\s/g, "_")
      .replace(/\//g, "_")
      .replace(/\(/g, "")
      .replace(/\)/g, "");
  }

  cpuFilterConvert(laptopData: any) {
    var cpu_name = laptopData.CPU_name;
    var index = cpu_name.indexOf(" ", cpu_name.indexOf(" ") + 1);

    if (cpu_name[0].toLowerCase() === "i") {
      return {
        slug: cpu_name
          .substring(0, index + 3)
          .toLowerCase()
          .replace(/\s/g, "_"),
        title: cpu_name.substring(0, index + 3),
      };
    } else {
      return {
        slug: cpu_name
          .substring(0, index + 2)
          .toLowerCase()
          .replace(/\s/g, "_"),
        title: cpu_name.substring(0, index + 2),
      };
    }
  }

  ramFilterConvert(ram_capacity: string) {
    var index = ram_capacity.indexOf("B");
    var ram = ram_capacity.substring(0, index + 1);

    return {
      slug: ram.toLocaleLowerCase(),
      title: ram,
    };
  }

  storageConvert(storage: string) {
    var index = storage.indexOf("D");
    var hardDrive = storage.substring(0, index +2).trimEnd();
    return {
      slug: hardDrive.toLocaleLowerCase().replace(/\s/g, "_"),
      title: hardDrive
    }
  }
}
