function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50"
      style={{backgroundColor:'rgba(0,0,0,0.4)'}}>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">

        {/* Icone */}
        <div className="flex flex-col items-center pt-8 pb-5 px-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{backgroundColor:'#FEF2F2'}}>
            <svg className="w-7 h-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>

          <h3 className="text-sm font-medium text-slate-800 text-center mb-1">
            Confirmer la suppression
          </h3>
          <p className="text-xs text-slate-400 text-center leading-relaxed">
            {message}
          </p>
        </div>

        {/* Séparateur */}
        <div className="h-px bg-slate-100 mx-6"></div>

        {/* Boutons */}
        <div className="flex gap-3 p-5">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 text-xs font-medium text-white rounded-xl transition"
            style={{backgroundColor:'#c02222'}}
            onMouseEnter={e => e.currentTarget.style.backgroundColor='#c02222'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor='#c02222'}
          >
            Supprimer
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmDialog;
