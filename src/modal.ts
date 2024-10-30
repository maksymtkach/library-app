export class Modal {
  constructor(public id: string) {}

  open(): void {
    const modal = document.getElementById(this.id);
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('role', 'dialog');
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      backdrop.id = 'backdrop-' + this.id;
      document.body.appendChild(backdrop);
    }
  }

  close(): void {
    const modal = document.getElementById(this.id);
    const backdrop = document.getElementById('backdrop-' + this.id);
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.removeAttribute('aria-modal');
      modal.removeAttribute('role');
      document.body.classList.remove('modal-open');
    }
    if (backdrop) {
      backdrop.remove();
    }
  }
}
