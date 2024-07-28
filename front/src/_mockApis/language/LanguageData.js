import mock from '../mock';

import FlagEn from 'src/assets/images/svgs/icon-flag-en.svg';
import FlagFr from 'src/assets/images/svgs/icon-flag-fr.svg';

const LanguageData = [
  {
    id: 1,
    flagname: 'English',
    icon: FlagEn,
  },
  {
    id: 2,
    flagname: 'French',
    icon: FlagFr,
  },
];

mock.onGet('/api/data/language/LanguageData').reply(() => {
  return [200, LanguageData];
});
export default LanguageData;
