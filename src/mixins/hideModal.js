export default {
  deactivated () {
    if (this.Loading.SHOW) this.hideLoading()
    if (this.Popup.SHOW) this.hidePopup()
  }
}
