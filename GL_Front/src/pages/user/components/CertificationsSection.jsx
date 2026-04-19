import { TextArea } from '../../../components/Form';

export const CertificationsSection = ({ formData, onChange }) => (
  <div>
    <h3 className="text-lg font-bold text-gray-900 mb-4">Formations et certifications</h3>
    <TextArea
      label="Détails des certifications et formations"
      name="certifications"
      value={formData.certifications}
      onChange={onChange}
      placeholder="ex: CAP mécanique (2019), Formation sécurité électrique (2022)..."
      rows={4}
    />
  </div>
);
