class HelpsPagination {
  static convertToPositiveInt(limit, page, defaultLimit, defaultPage) {
    limit = !limit ? defaultLimit : parseInt(limit);
    page = !page ? defaultPage : parseInt(page);
    const offset = !page ? 0 : --page * limit;
    return { limit, page, offset };
  }

  static optionPagination(option, { getLimit, page }) {
    const { limit, offset } = HelpsPagination.convertToPositiveInt(getLimit, page, 2, 1);
    return {
      ...option,
      limit,
      offset
    };
  }
}

export default HelpsPagination;
