import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import Field from '../../components/ui/Field';
import { SecLabel } from '../../components/ui/bits';
import { D } from '../../data/icons';

export default function EditProfileScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState('Dr. Ahmad Santoso');
  const [email, setEmail] = useState('ahmad.santoso@gmail.com');
  const [phone, setPhone] = useState('+62 812 3456 7890');
  const [country, setCountry] = useState('Indonesia');
  const [specialty, setSpecialty] = useState('Nephrology');
  const [institution, setInstitution] = useState('RSUPN Dr. Cipto Mangunkusumo');

  return (
    <div className="min-h-screen animate-screen-in bg-paper pb-28 md:pb-12">
      <PageHeader title="Edit Profile" backTo="/profile" right={<div className="w-10" />} />

      <div className="flex flex-col items-center bg-brand-deep pt-[22px] pb-[30px]">
        <div className="relative">
          <span className="flex h-[90px] w-[90px] items-center justify-center rounded-[28px] border-[3px] border-white/28 bg-gradient-to-br from-[#ffb877] to-brand-top text-3xl font-extrabold text-white">
            AS
          </span>
          <button
            type="button"
            aria-label="Change photo"
            className="absolute -right-1.5 -bottom-1.5 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-brand-deep bg-warm"
          >
            <Icon d={D.pen} s={15} c="#fff" sw={1.9} />
          </button>
        </div>
        <div className="mt-[13px] text-[12.5px] font-bold text-white/65">Tap to change photo</div>
      </div>

      <form
        className="mx-auto flex max-w-2xl flex-col gap-3.5 px-[18px] pt-[22px] md:px-8"
        onSubmit={(e) => {
          e.preventDefault();
          navigate('/profile');
        }}
      >
        <SecLabel className="mb-0.5">Personal Info</SecLabel>
        <Field label="Full Name" value={name} onChange={setName} icon={<Icon d={D.user} s={17} c="#f15a24" />} />
        <Field label="Email Address" value={email} onChange={setEmail} type="email" icon={<Icon d={D.mail} s={17} c="#f15a24" />} />
        <Field label="Phone Number" value={phone} onChange={setPhone} type="tel" icon={<Icon d={D.phone} s={17} c="#f15a24" />} />
        <Field
          label="Country"
          value={country}
          onChange={setCountry}
          icon={<Icon d={D.globe} s={17} c="#f15a24" />}
          trailing={<Icon d={D.chev} s={17} c="#b8b3ab" />}
        />
        <SecLabel className="mt-2 mb-0.5">Professional Info</SecLabel>
        <Field label="Specialty" value={specialty} onChange={setSpecialty} trailing={<Icon d={D.chev} s={17} c="#b8b3ab" />} />
        <Field label="Institution" value={institution} onChange={setInstitution} />

        <div className="mt-4 hidden md:block">
          <Button type="submit">Save Changes</Button>
        </div>

        <div className="fixed inset-x-0 bottom-[78px] z-30 border-t border-line bg-white px-[18px] py-3 shadow-[0_-8px_20px_-12px_rgba(20,16,12,0.18)] md:hidden">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
