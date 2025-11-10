package com.deltaspace.lab.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.deltaspace.lab.model.ImportData;
import com.deltaspace.lab.repository.ImportRepository;

@Service
public class ImportService {

    private final ImportRepository importRepository;
    private final FileService fileService;

    public ImportService(
        ImportRepository importRepository,
        FileService fileService
    ) {
        this.importRepository = importRepository;
        this.fileService = fileService;
    }

    public Integer importFile(MultipartFile file, String username) {
        try {
            Integer count = fileService.processFile(file, username);
            ImportData data = new ImportData(true, username, count);
            importRepository.save(data);
            return count;
        } catch (Exception exception) {
            ImportData data = new ImportData(false, username, null);
            importRepository.save(data);
            throw new RuntimeException();
        }
    }

    public Long getAmount(String username) {
        if ("admin".equals(username)) {
            return importRepository.count();
        }
        return importRepository.countByUsername(username);
    }

    public List<ImportData> getImportHistory(
        Pageable pageable,
        String username
    ) {
        if ("admin".equals(username)) {
            return importRepository.findAll(pageable).getContent();
        }
        return importRepository
            .findByUsername(username, pageable)
            .getContent();
    }

}
