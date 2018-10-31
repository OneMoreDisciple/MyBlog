module.exports = function (dateString) {
    let week = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
    let months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    let date = new Date(dateString)
    let dateFormat = week[date.getDay() - 1] + ' ' + date.getDate() + ' ' + months[date.getMonth() - 1] + ' ' + date.getFullYear() + ' à ' + date.getHours() + 'h'

    return dateFormat
}