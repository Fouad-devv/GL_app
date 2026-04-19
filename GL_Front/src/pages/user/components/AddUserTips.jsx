import { Card } from '../../../components/Card';

export const AddUserTips = () => (
  <Card className="max-w-2xl mt-6 bg-amber-50">
    <h3 className="font-bold text-amber-900 mb-2">Conseils</h3>
    <ul className="text-sm text-amber-800 space-y-1">
      <li>• Assurez-vous que l'email est unique dans le système</li>
      <li>• Le mot de passe doit contenir au moins 8 caractères</li>
      <li>• Sélectionnez les spécialités appropriées pour l'assignation optimale des tâches</li>
      <li>• Vous pouvez mettre à jour les informations ultérieurement via la page de gestion des utilisateurs</li>
    </ul>
  </Card>
);
