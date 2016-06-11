export function pluralize(number, string, options) {
  if (_.isUndefined(options)) options = {};
  _.defaults(options, {
    commafy: false,
    number: true,
  });
  let numberDisplay = number;
  if (options.commafy) numberDisplay = commafy(number);
  let prefix = numberDisplay + ' ';
  if (!options.number) prefix = '';
  return prefix + string + (number === 1 ? '' : 's');
}

export function commafy(number) {
  let string = number.toString();
  let parts = string.split('.');

  parts[0] = parts[0].replace(/\d(?=(\d{3})+(?!\d))/g, '$&,');
  return parts.join('.');
};
