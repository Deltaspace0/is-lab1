package com.deltaspace.lab.service;

import java.util.Set;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class PageService {

    public Pageable getPageable(
        Integer pageNumber,
        Integer pageSize,
        String sortField,
        String sortOrder,
        Set<String> allowedSortFields
    ) {
        if (sortField == null) {
            return PageRequest.of(pageNumber, pageSize);
        }
        if (!allowedSortFields.contains(sortField)) {
            throw new RuntimeException("Wrong field: "+sortField);
        }
        if (!"desc".equals(sortOrder) && !"asc".equals(sortOrder)) {
            throw new RuntimeException("Wrong sort order: "+sortOrder);
        }
        Sort sort = "asc".equals(sortOrder)
            ? Sort.by(sortField).ascending()
            : Sort.by(sortField).descending();
        return PageRequest.of(pageNumber, pageSize, sort);
    }

}
