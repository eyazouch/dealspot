package com.dealspot.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.dealspot.backend.entity.RapportVendor;
import com.dealspot.backend.service.RapportService;

import java.util.List;

@RestController
@RequestMapping("/api/rapports")
@CrossOrigin(origins = "http://localhost:5173")  // ← VÉRIFIE QUE C'EST ICI
public class RapportController {
    
    @Autowired
    private RapportService rapportService;
    
    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<RapportVendor>> getRapportsVendor(@PathVariable Long vendorId) {
        List<RapportVendor> rapports = rapportService.getRapportsVendor(vendorId);
        return ResponseEntity.ok(rapports);
    }
    
    @PostMapping("/vendor/{vendorId}/generer")
    public ResponseEntity<String> genererRapportManuel(
            @PathVariable Long vendorId,
            @RequestParam String periode) {
        
        com.dealspot.backend.entity.User vendor = new com.dealspot.backend.entity.User();
        vendor.setId(vendorId);
        
        rapportService.genererRapport(vendor, periode);
        
        return ResponseEntity.ok("Rapport " + periode + " généré avec succès");
    }
}