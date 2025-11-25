export type LanguageCode = 'en' | 'fr' | 'es' | 'ar';

type TranslationDictionary = Record<string, string>;

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    'app.name': 'The Moroccan Physio',
    // ...existing keys...
    'FirstName': 'First name',
    'LastName': 'Last name',
    'Dob': 'Date of birth',
    'Phone': 'Phone',
    'Email': 'Email',
    'Role': 'Role',
    'PatientId': 'Patient',
    'Amount': 'Amount',
    'Status': 'Status',
    'Date': 'Date',
    'PractitionerId': 'Practitioner',
    'Type': 'Type',
    'Prescriber': 'Prescriber',
    'SessionsPrescribed': 'Sessions prescribed',
    'Annuler': 'Cancel',
    'Sauvegarder': 'Save',
    'Modifier': 'Edit',
    'Créer': 'Create'
    // ...rest of keys...
  },
  fr: {
    'app.name': 'Le Kiné Marocain',
    // ...existing keys...
    'FirstName': 'Prénom',
    'LastName': 'Nom',
    'Dob': 'Date de naissance',
    'Phone': 'Téléphone',
    'Email': 'Email',
    'Role': 'Rôle',
    'PatientId': 'Patient',
    'Amount': 'Montant',
    'Status': 'Statut',
    'Date': 'Date',
    'PractitionerId': 'Praticien',
    'Type': 'Type',
    'Prescriber': 'Prescripteur',
    'SessionsPrescribed': 'Séances prescrites',
    'Annuler': 'Annuler',
    'Sauvegarder': 'Sauvegarder',
    'Modifier': 'Modifier',
    'Créer': 'Créer'
    // ...rest of keys...
  },
  es: {
    'app.name': 'El Fisio Marroquí',
    // ...existing keys...
    'FirstName': 'Nombre',
    'LastName': 'Apellido',
    'Dob': 'Fecha de nacimiento',
    'Phone': 'Teléfono',
    'Email': 'Correo',
    'Role': 'Rol',
    'PatientId': 'Paciente',
    'Amount': 'Importe',
    'Status': 'Estado',
    'Date': 'Fecha',
    'PractitionerId': 'Profesional',
    'Type': 'Tipo',
    'Prescriber': 'Prescriptor',
    'SessionsPrescribed': 'Sesiones prescritas',
    'Annuler': 'Cancelar',
    'Sauvegarder': 'Guardar',
    'Modifier': 'Editar',
    'Créer': 'Crear'
    // ...rest of keys...
  },
  ar: {
    'app.name': 'أخصائي العلاج الطبيعي المغربي',
    // ...existing keys...
    'FirstName': 'الاسم الأول',
    'LastName': 'اسم العائلة',
    'Dob': 'تاريخ الميلاد',
    'Phone': 'الهاتف',
    'Email': 'البريد الإلكتروني',
    'Role': 'الدور',
    'PatientId': 'المريض',
    'Amount': 'المبلغ',
    'Status': 'الحالة',
    'Date': 'التاريخ',
    'PractitionerId': 'المعالج',
    'Type': 'النوع',
    'Prescriber': 'الطبيب المعالج',
    'SessionsPrescribed': 'الجلسات الموصوفة',
    'Annuler': 'إلغاء',
    'Sauvegarder': 'حفظ',
    'Modifier': 'تعديل',
    'Créer': 'إنشاء'
    // ...rest of keys...
  }
};
