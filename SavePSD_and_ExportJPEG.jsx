// SavePSD_and_ExportJPEG_Fixed.jsx
var doc = app.activeDocument;

// =============================================
// РУЧНАЯ РЕАЛИЗАЦИЯ trim() ДЛЯ СТАРЫХ ВЕРСИЙ
// =============================================
function trimString(str) {
    if (typeof str.trim === 'function') {
        return str.trim(); // для новых версий
    } else {
        // для старых версий (ручная обрезка пробелов)
        return str.replace(/^\s+/, '').replace(/\s+$/, '');
    }
}

// Укажите точные имена ваших слоёв
var nameLayer = doc.layers.getByName("Название мероприятия");
var dateLayer = doc.layers.getByName("Дата мероприятия");

if (!nameLayer || !dateLayer) {
    var layerList = "Доступные слои:\n";
    for (var i = 0; i < doc.layers.length; i++) {
        layerList += (i + 1) + ". " + doc.layers[i].name + "\n";
    }
    alert("❌ Ошибка! Не найден слой.\n\n" + layerList +
        "\nУкажите правильные имена слоёв в скрипте.");
} else {
    try {
        // Формируем имя файла
        var eventName = nameLayer.textItem.contents.toUpperCase();
        var eventDate = dateLayer.textItem.contents;
        var fileName = eventName + " " + eventDate;

        // =============================================
        // ПОЛНАЯ ОЧИСТКА ИМЕНИ ФАЙЛА
        // =============================================
        // 1. Удаляем все запрещённые символы Windows: \ / : * ? " < > |
        fileName = fileName.replace(/[\/\\\:\*\?\"\<\>\|]/g, '');

        // 2. Удаляем многоточие (троеточие) … и ...
        fileName = fileName.replace(/\.\.\./g, '');
        fileName = fileName.replace(/…/g, '');

        // 3. Удаляем точки в конце (Windows не любит)
        fileName = fileName.replace(/\.+$/, '');

        // 4. Удаляем другие проблемные символы
        fileName = fileName.replace(/[;,=+]/g, '');

        // 5. Заменяем множественные пробелы на один
        fileName = fileName.replace(/\s+/g, ' ');

        // 6. Удаляем пробелы в начале и конце (используем нашу функцию)
        fileName = trimString(fileName);

        // 7. Если имя стало пустым — используем "Баннер"
        if (fileName.length === 0) {
            fileName = "Баннер";
        }

        // =============================================
        // 1. СОХРАНЯЕМ PSD
        // =============================================
        var psFolder = new Folder("O:/Зооинформ/Люди/Тронин Д/Дизайн/Баннеры/Важные мероприятия/PS");

        if (!psFolder.exists) {
            psFolder.create();
            alert("📁 Создана папка: PS");
        }

        var psdPath = psFolder + "/" + fileName + ".psd";
        var psdFile = new File(psdPath);

        var psdOptions = new PhotoshopSaveOptions();
        psdOptions.embedColorProfile = true;
        psdOptions.alphaChannels = true;
        psdOptions.layers = true;
        psdOptions.spotColors = true;

        doc.saveAs(psdFile, psdOptions, true, Extension.LOWERCASE);
        alert("✅ 1. PSD сохранён:\n" + psdPath);

        // =============================================
        // 2. ЭКСПОРТИРУЕМ JPEG
        // =============================================
        var bannersFolder = new Folder("O:/Зооинформ/Люди/Тронин Д/Дизайн/Баннеры/Важные мероприятия/Баннеры");

        if (!bannersFolder.exists) {
            bannersFolder.create();
            alert("📁 Создана папка: Баннеры");
        }

        var jpegPath = bannersFolder + "/" + fileName + ".jpg";
        var jpegFile = new File(jpegPath);

        var jpegOptions = new JPEGSaveOptions();
        jpegOptions.quality = 10;
        jpegOptions.embedColorProfile = true;
        jpegOptions.formatOptions = FormatOptions.STANDARDBASELINE;

        doc.saveAs(jpegFile, jpegOptions, true, Extension.LOWERCASE);

        alert("✅ 2. JPEG сохранён:\n" + jpegPath +
            "\n\n✅ Готово! Файлы сохранены в:\n" +
            "📁 PS: " + psFolder.fsName + "\n" +
            "📁 Баннеры: " + bannersFolder.fsName);

    } catch (e) {
        alert("❌ Ошибка: " + e.message);
    }
}